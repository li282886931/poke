# 文档导航

本文档目录按“产品规则、技术方案、当前实现”组织。原始研发方案保留，当前实现以 monorepo、Go 后端与小程序接入设计为准。

## 产品规格

| 文档 | 用途 | 适用阶段 |
| --- | --- | --- |
| [页面流与逐页交互规格](superpowers/specs/2026-10-12-wanqiyuan-page-flow-and-interaction-spec.md) | 定义角色、状态机、页面字段、跨页面权限规则与后台范围 | 产品设计、前后端联调、验收 |

## 技术方案

| 文档 | 用途 | 适用阶段 |
| --- | --- | --- |
| [Monorepo、Go 后端与小程序接口接入设计](superpowers/specs/2026-10-12-monorepo-go-mongodb-miniapp-design.md) | 定义 `miniapp/`、`server/`、Go API、MongoDB 连接与 mock 回退边界 | 当前实现、前后端联调 |
| [研发方案](万栖源全品类资源撮合平台_研发方案.md) | 早期 P0 边界与系统治理方案，部分 CloudBase 表述已被 v4 Go/MongoDB 技术栈替代 | 历史参考、规则设计 |

## 当前交付与规格的对应关系

| 规格模块 | 当前状态 | 代码入口 |
| --- | --- | --- |
| 居民与师傅角色工作台 | 已实现为本地状态切换 | `miniapp/src/store/session.ts`、`miniapp/src/pages/index` |
| 发布与语音确认 | 已实现页面流程与 mock | `miniapp/src/pages/publish`、`miniapp/src/pages/voice-confirm` |
| 发布状态与匹配展示 | 已实现主要展示态 | `miniapp/src/pages/publish-detail`、`miniapp/src/pages/matches` |
| 优先窗口与解锁 | 已实现前端规则、Go API 骨架和 mock 回退 | `miniapp/src/domain/rules.js`、`miniapp/src/pages/unlock`、`server/` |
| 额度与流水 | 已实现 mock UI 与解锁 API 骨架 | `miniapp/src/pages/credits`、`server/` |
| 消息、反馈与申诉 | 已实现消息列表、反馈提交界面 | `miniapp/src/pages/messages`、`miniapp/src/pages/feedback` |
| 运营后台 | 仅在规格和研发方案中定义，尚未实现 | 页面规格 ADM-01 至 ADM-07 |
| 审核、实名、内容安全、地图、语音、支付 | 待接入第三方服务与正式 Go/MongoDB 环境 | 研发方案第 3 至 5 章 |

## 阅读顺序

1. 先阅读页面流与逐页交互规格，确认角色权限、状态与用户可见行为。
2. 再阅读研发方案，确认服务端一致性、数据隐私和 P0 技术边界。
3. 最后阅读根目录 [README](../README.md)，了解 monorepo 目录、Go API、小程序构建与本地验证方法。

## 维护规则

- 产品字段、状态和页面跳转变更：先更新页面流与交互规格。
- 架构、集合、后端 API、隐私或基础设施变更：更新研发方案或当前接入设计。
- 已实现范围、运行方式、目录或测试变更：更新根目录 README。
- 未实现能力必须标注为“待接入”或“仅规格定义”，不得在 README 中表述为已上线能力。
