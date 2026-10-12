# 万栖源 Monorepo、Go 后端与小程序接口接入设计

## 背景

当前仓库是一个位于根目录的 Taro 微信小程序项目，页面、Mock 数据、主题、图标和基础测试已经可运行。v4 产品开发要求已将技术栈定稿为自购云服务器部署：Go 后端 API + MongoDB + Redis（本期内置）+ 对象存储，并要求客户端不得直写数据库，所有读写通过服务端 API 完成。

本次目标是把小程序放进独立文件夹，新增 Go 后端与 MongoDB 连接逻辑，并让小程序服务层具备调用后端 API 的入口。为了控制风险，本次不实现完整运营后台、微信支付、短信、实名核验、对象存储上传和 Redis 事件推送，只建立可测试、可扩展的后端边界。

## 推荐方案

采用 monorepo 结构：

```text
/
  miniapp/      Taro 微信小程序
  server/       Go HTTP API 服务
  docs/         产品、研发和实现文档
  README.md     根项目说明
```

`miniapp/` 保留现有页面和 Mock 数据，所有 Taro 配置、依赖、测试随前端一起移动。根目录只保留跨端说明和后端入口说明。

`server/` 新增 Go module，使用标准库 `net/http` 作为第一版 API 层，使用 MongoDB 官方 Go Driver 作为数据库连接层。服务启动时读取环境变量，不在代码中写入任何密钥或真实连接串。

## 后端接口范围

首版提供以下接口：

| 接口 | 方法 | 用途 |
| --- | --- | --- |
| `/healthz` | GET | 服务健康检查，返回 MongoDB 连接状态 |
| `/api/v1/dashboard` | GET | 返回首页工作台数据：列表、匹配、消息、品类 |
| `/api/v1/listings` | POST | 创建需求线索，进入 `pending_confirmation` 或 `submitted` |
| `/api/v1/unlocks` | POST | 创建解锁记录，返回联系人展示状态和额度变化摘要 |

这些接口先覆盖小程序已有 `getDashboard`、`createListing`、`unlockMatch` 三个服务调用。数据结构与当前 mock 保持兼容，后续可逐步扩展到真实状态机、额度事务、风控、反馈和申诉。

## MongoDB 边界

后端会提供 `MongoStore` 和 `SeedStore` 两种数据源：

- `MongoStore`：配置 `MONGO_URI` 后连接 MongoDB，使用 `MONGO_DATABASE` 指定数据库。
- `SeedStore`：未配置 MongoDB 或连接不可用时启用，用内置样例数据返回接口结果。

这样本地开发不依赖外部数据库，小程序仍能打开；部署环境配置 MongoDB 后即可切换为真实集合读写。首版集合名与 v4 文档保持一致方向：`leads`、`messages`、`categories`、`unlocks`、`credit_accounts`，不新增品类专属集合。

## 小程序接入

`miniapp/src/services/cloud.ts` 调整为统一 API 客户端：

- 优先通过 Taro request 调用 `http://127.0.0.1:8080/api/v1/*` 或构建时注入的 API Base URL。
- 当 API 请求失败、超时或返回非成功状态时，回退当前本地 mock。
- 小程序运行时代码继续避免直接读取 `process.env`，以常量注入或配置文件方式提供 API 地址。

## 错误处理

后端统一返回 JSON：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

失败时 `code` 非 0，HTTP 状态码按错误类型返回。小程序服务层只把 `code = 0` 视为成功，其他情况进入 mock 回退或展示业务错误。

## 测试策略

按测试先行推进：

1. 后端 handler 测试：验证健康检查、工作台、发布和解锁接口的 JSON 契约。
2. 后端 store 测试：验证未配置 MongoDB 时使用 SeedStore，配置无效时不会导致服务启动崩溃。
3. 小程序服务测试：验证服务层包含 API 调用入口、运行时代码不读取 `process.env`，且保留本地 mock 回退。
4. 结构测试：验证根目录不再直接承载 Taro `src/config/types/tests`，小程序完整位于 `miniapp/`。

## 非目标

- 不实现微信支付、短信、实名核验、对象存储上传。
- 不实现运营后台 Web 端。
- 不实现 Redis TTL 事件推送和完整解锁事务 Saga。
- 不迁移到 uni-app；当前已有 Taro 项目继续保留，后续如需严格按 v4 改 uni-app，应单独立项迁移。

## 验收标准

- `miniapp/` 下可以运行现有测试和微信小程序构建。
- `server/` 下可以运行 Go 单元测试。
- `server/` 可启动并返回 `/healthz` 与 `/api/v1/dashboard`。
- 小程序服务层具备真实 API 调用路径，API 不可用时仍可回退 mock。
- 根 README 清晰说明 monorepo 结构、启动方式、环境变量和当前实现边界。
