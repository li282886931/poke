# 万栖源全品类资源撮合平台

万栖源是面向居民、商家与服务资源方的全品类资源撮合平台。当前仓库采用 monorepo 结构，包含微信小程序前端与 Go 后端 API。平台提供需求发布、资源匹配、线索解锁、反馈申诉、客服工单与履约留痕能力；交易资金在线下自行结算，系统不做托管、分账或代收代付。

## 目录结构

```text
miniapp/       Taro 微信小程序，居民端与师傅端角色合一
server/        Go HTTP API，连接 MongoDB，开发态可回退 seed 数据
docs/          产品要求、研发方案与设计规格
tests/         仓库结构级回归测试
```

## 当前实现范围

- 小程序首版页面：`首页`、`匹配`、`消息`、`我的`、发布、语音确认、发布详情、匹配详情、解锁、认证范围、额度账户、反馈申诉。
- 小程序服务层：优先调用 Go API，接口不可用时回退本地 mock，保证本地页面可运行。
- Go 后端：`/healthz`、`/api/v1/dashboard`、`/api/v1/listings`、`/api/v1/unlocks`、`/api/v1/voice-demands`。
- 语音需求处理：当前接口接收语音转写文本和音频元信息，抽取城市、区域、品类，并匹配后端资源池；命中资源时排队通知资源方联系用户，未命中时进入等待匹配。
- MongoDB 接入：配置 `MONGO_URI` 后连接 MongoDB；未配置或连接失败时使用 seed 数据。
- 合规边界：无 C 端与 B 端在线聊天；双方仅在线索解锁后电话联系。客服、申诉、服务确认单、72 小时反馈与评价承担平台留痕。

## 后端快速开始

```bash
cd server
cp .env.example .env
SERVER_ADDR=:8080 MONGO_URI= MONGO_DATABASE=wanqiyuan_dev go run ./cmd/api
```

健康检查：

```bash
curl http://127.0.0.1:8080/healthz
```

提交语音需求转写文本：

```bash
curl -X POST http://127.0.0.1:8080/api/v1/voice-demands \
  -H 'Content-Type: application/json' \
  -d '{"userId":"user-01","transcript":"我在成都高新区，急需500平米冷库","durationSeconds":6}'
```

未配置 MongoDB 时会返回 `store=seed`，用于本地联调。

## 小程序快速开始

```bash
cd miniapp
npm install
npm run build:weapp
```

运行小程序测试：

```bash
cd miniapp
npm test
```

根目录结构测试：

```bash
node --test tests/*.test.js
```

## 环境变量

后端环境变量：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `SERVER_ADDR` | `:8080` | API 服务监听地址 |
| `MONGO_URI` | 空 | MongoDB 连接串，空值启用 seed 数据 |
| `MONGO_DATABASE` | `wanqiyuan` | MongoDB 数据库名 |

小程序当前 API 地址固定为 `http://127.0.0.1:8080`，后续可在构建配置中扩展为 dev/prod 双环境注入。

## 关键规则

- C 端永久免费，平台收入来自师傅线索解锁费或额度包充值。
- 解锁只消耗额度余额，不在解锁环节调用支付。
- iOS 端不展示充值入口、付费引导、外链、二维码或客服收款话术。
- 中置信线索禁止独锁，高危品类需人工核验后入池。
- 解锁后 72 小时必须四选一反馈；不反馈冻结等额额度。
- 仅“无效打不通或未发布”进入退款核验，“价格不合适”不退款。
- 平台不提供供需双方 IM、留言板、站内聊天。

## 后续接入方向

- 将 seed 数据替换为完整 MongoDB 集合读写和索引初始化。
- 将当前 `transcript` 输入替换为真实 ASR 服务回调，保留后端匹配接口契约。
- 引入 Redis TTL 事件，实现 15 秒优先权秒级释放和推送。
- 接入真实微信登录、订阅消息、短信、实名核验、支付充值和对象存储。
- 补齐管理后台、规则配置、仲裁、调价审计与对账能力。
