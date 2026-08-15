# SuisoruIX Material You UI 重构指南

> 项目：`RinCynar/SuisoruIX`（fork 自 `imsyy/SNav`），部署于 start.rincynar.top
> 技术栈：Vue 3 + Vite + Pinia + Sass + Naive UI + `@material/material-color-utilities`
> 目标：从"四不像"（部分 M3 + 部分 SNav 原始样式 + 部分 Naive UI 默认样式混杂）收敛为一套**自洽、克制、正统的 Material Design 3（Material You）**视觉系统。

---

## 0. 先诊断：为什么现在会"四不像"

在动手之前，Agent 应该先确认问题的根源，而不是直接开始改样式。这类"Material You 换皮失败"的项目，几乎总是同一批病因，建议逐条排查：

1. **三套设计语言在打架**：
   - `imsyy/SNav` 原版是玻璃拟态（glassmorphism：模糊背景 + 半透明卡片 + 强阴影）风格；
   - README 里描述的"Material 3 refactor"引入了 M3 的色彩系统（HCT 动态取色）；
   - `Naive UI` 组件库自带一套 antd 风格的默认 token（圆角、阴影、间距、字重）。
   三者从未被统一到同一套 token 之下，导致同一个页面里，搜索框是玻璃拟态，按钮是 Naive UI 默认样式，卡片圆角是 M3 建议值——三种"手感"并存。

2. **色彩只做了"取色"，没做"分层"**：M3 的核心不是"生成一个紫色调色板"，而是完整的 **Surface Container 分层系统**（surface / surface-dim / surface-bright / surface-container-lowest → highest 共 6 级）。如果项目只是把 `primary` 换成了动态色，卡片、面板、弹层仍然用的是任意 `rgba(255,255,255,0.x)`，层次感就会失控。

3. **圆角（Shape）没有系统化**：M3 的 Shape Scale 是有明确档位的（none / extra-small 4dp / small 8dp / medium 12dp / large 16dp / extra-large 28dp / full）。如果项目里圆角是"设计师手感"式的随意取值（比如按钮 6px、卡片 10px、弹层 20px 没有规律），视觉上会显得凌乱。

4. **字体排印（Typography）没有建立 Type Scale**：M3 有 15 档明确的字号/字重/行高组合（Display / Headline / Title / Body / Label，每档 Large/Medium/Small）。很多"Material You 风格"项目只是换了字体，没有建立层级，导致标题、正文、说明文字视觉权重雷同。

5. **背景自定义壁纸和 M3 Surface 系统冲突**：SNav 系产品的一大特色是"用户自己上传壁纸做背景"，这和 M3 强调的"背景色由取色算法统一生成、卡片靠 Surface Container 分层"天然矛盾——用户传一张五颜六色的壁纸，上面叠一层"正统 M3 配色"的卡片，必然显得违和。这一点必须做取舍（见第 4 节）。

Agent 在改代码前应先用浏览器打开 start.rincynar.top，对照上面 5 点截图记录问题，再开始按下面的方案重构。

---

## 1. 设计原则（写给 Agent 的北极星）

重构过程中，每次做视觉决策时用这 4 条原则做校验：

- **单一色彩来源**：所有颜色必须来自同一套 M3 Token（见第 2 节），禁止在组件里出现任意 `#fff`、`rgba(0,0,0,.5)`、Naive UI 默认色等"游离色值"。
- **克制而非炫技**：M3 不是"越多渐变/越多模糊越现代"，而是靠色彩层次、留白、微妙阴影表达质感。玻璃拟态（强模糊 + 强透明）应该整体移除或降级为**可选的背景效果**，不作为默认组件风格。
- **一套圆角、一套阴影、一套间距**：全局只允许使用第 3 节定义的 token 值，不允许组件级"手感调整"。
- **组件库要"驯服"，不要"共存"**：Naive UI 必须通过 `theme-overrides` 完全接管为 M3 token，而不是让 Naive UI 默认皮肤和自定义 M3 组件并列出现。

---

## 2. 色彩系统（Color System）

### 2.1 保留并规范化取色逻辑

项目已经引入 `@material/material-color-utilities`，这是对的，**不需要换库**，需要规范"怎么用"。

- 取色算法：`argbFromHex(seedColor)` → `Hct.fromInt()` → `DynamicScheme`（推荐用 `SchemeTonalSpot` 作为默认方案，视觉上比 `SchemeVibrant`/`SchemeExpressive` 更接近"正统 Material You"，不容易花哨）。
- 同时生成 **Light Scheme 和 Dark Scheme** 两套完整 token，不要只生成一套再用 CSS filter 强行反色。
- 关闭"自定义壁纸背景"时，页面背景色必须用 `surface` token（不是纯白/纯黑），这样才有 M3 该有的"呼吸感"。

### 2.2 必须建立的 Surface Container 六级分层

这是当前项目大概率缺失的部分，务必补齐（对照官方命名，在 `src/style` 下建一个 `_tokens.scss` 或 CSS 变量层）：

```
--md-sys-color-surface-dim
--md-sys-color-surface
--md-sys-color-surface-bright
--md-sys-color-surface-container-lowest
--md-sys-color-surface-container-low
--md-sys-color-surface-container
--md-sys-color-surface-container-high
--md-sys-color-surface-container-highest
```

**分层使用规则（这是消除"四不像"感的关键）**：
- 页面最底层背景 → `surface` / `surface-dim`
- 搜索框、时钟等"浮在背景上"的一级元素 → `surface-container-low` 或 `surface-container`
- 快捷方式卡片、天气卡片等二级元素 → `surface-container-high`
- 弹出的设置面板 / Modal / Drawer → `surface-container-highest`（层级越高，越"靠近用户"）

其余必须补齐的语义色 token：`primary` / `on-primary` / `primary-container` / `on-primary-container`、`secondary` 系、`tertiary` 系、`error` 系、`outline` / `outline-variant`。全部通过 CSS 自定义属性挂在 `:root`，Naive UI 的 `theme-overrides` 直接引用这些变量，不要重复定义一套。

### 2.3 关于自定义壁纸背景的取舍（重要决策点）

现状：SNav 系产品允许用户传壁纸做背景，这和"正统 M3 Surface 分层"冲突。建议给 Agent 两个选项，二选一（不要试图两者都要）：

- **方案 A（更贴近 M3 正统）**：默认关闭壁纸模式，主推"Material 3 动态取色 + 纯色 Surface 背景"，壁纸模式作为一个明确标注为"自定义主题"的独立分支，启用后自动切换到更保守的"半透明卡片 + 轻度模糊"子样式，且圆角/间距等其余 token 保持不变，只有透明度和模糊变化。这样至少让"壁纸模式"和"M3 模式"在同一套骨架下，不是两套皮肤。
- **方案 B（保留个性化卖点）**：壁纸模式作为默认卖点保留，但取色逻辑改为"从壁纸中提取主色 → 生成 M3 动态色板"（用 `material-color-utilities` 的 `QuantizerCelebi` 从图片取色），卡片统一使用**低透明度 + 高斯模糊 + `surface-container` 色作为模糊层的 tint 色**，而不是任意 `rgba(255,255,255,.x)`。这样玻璃拟态本身也纳入 M3 token 体系，而不是游离在外。

README 目前写的是"Default 随机壁纸 / Material 3 纯色背景 / Custom 自定义"三选一，建议保留这个结构，但**明确规定**：只有"Material 3 模式"下才是严格 M3 皮肤，"随机壁纸"和"自定义壁纸"模式统一走方案 B 的"取色 + tint 模糊"逻辑，不能让壁纸模式退回到没有色彩系统约束的旧 SNav 皮肤。

---

## 3. Shape / Elevation / Spacing / Motion Token

在 `_tokens.scss` 中统一定义，所有组件禁止写字面量：

**圆角（Shape Scale）**
```
--md-sys-shape-corner-none: 0px;
--md-sys-shape-corner-extra-small: 4px;
--md-sys-shape-corner-small: 8px;
--md-sys-shape-corner-medium: 12px;
--md-sys-shape-corner-large: 16px;
--md-sys-shape-corner-extra-large: 28px;
--md-sys-shape-corner-full: 999px;
```
使用规则：小控件（chip、icon button）用 small/medium；卡片用 large；搜索框、大面板、Bottom Sheet 用 extra-large；头像/圆形按钮用 full。

**阴影（Elevation，M3 用"色调叠加"代替传统黑色阴影）**
M3 的 elevation 不只是加深阴影，更重要的是给表面叠加 `primary` 色的低透明度 tint。建议 5 档：level 0（无阴影，无 tint）→ level 5（悬浮菜单、拖拽中的卡片）。日常卡片用 level 1，Hover 时升到 level 2，不要用 SNav 原有的重阴影。

**间距（8dp 基线网格）**
统一用 4px 为最小单位、8px 为标准步进（4/8/12/16/24/32/48），替换项目里可能存在的"随意 px 值"。

**动效（Motion）**
M3 标准缓动曲线（务必替换掉默认的 `ease` / `linear`）：
```
--md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
--md-sys-motion-easing-emphasized: cubic-bezier(0.3, 0, 0.8, 0.15); /* 进入 */
--md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
```
时长：小控件状态变化 100–200ms，卡片/面板展开收起 250–400ms，页面级转场可到 500ms。所有 `transition` 统一引用这几个变量。

---

## 4. 字体排印（Typography Scale）

建立 M3 标准 15 档 Type Scale 的一个精简子集（起始页场景不需要全部 15 档，建议保留 8 档即可，避免过度工程）：

| Token | 字号/行高 | 用途 |
|---|---|---|
| `display-large` | 57/64 | 时钟大字（如果时钟是页面视觉焦点） |
| `headline-medium` | 28/36 | 欢迎语 / 问候语 |
| `title-large` | 22/28 | 设置面板分区标题 |
| `title-medium` | 16/24 | 快捷方式卡片标题 |
| `body-large` | 16/24 | 搜索框输入文字 |
| `body-medium` | 14/20 | 一般正文 |
| `label-large` | 14/20 | 按钮文字 |
| `label-small` | 11/16 | 时间戳、次要说明 |

字体族：中文场景建议 `Roboto`（英文/数字）+ 系统默认中文字体（`-apple-system, "PingFang SC", "Microsoft YaHei"`) 的组合，不要额外引入装饰性字体——起始页是高频使用的工具类页面，字体首要目标是清晰、加载快，不是个性张扬。

---

## 5. 逐模块重构清单

结合项目结构（`src/components/AllFunc`、`src/components/SearchInput`）逐一过一遍：

### 5.1 搜索框（SearchInput）
- 容器：`surface-container-low`，圆角 `extra-large`（M3 搜索框标志性的"药丸形"或大圆角矩形），高度建议 56px，符合 M3 搜索栏规范。
- 聚焦态：边框/阴影从 level 0 → level 2，同时轻微放大（scale 1.0 → 1.02，用 `emphasized-decelerate` 缓动），给出明确的焦点反馈，替代当前可能存在的"生硬边框变色"。
- 搜索引擎切换器：改成 M3 的 `Menu` / `Chip` 组件形态，图标 + 文字组合，避免用 Naive UI 默认下拉框样式（会和周围格格不入）。

### 5.2 快捷方式网格（Shortcuts）
- 卡片背景：`surface-container-high`，圆角 `large`（16px）。
- 图标容器：用 M3 的 "container shape" 处理——图标外面包一层 `primary-container` 色的圆角背景，而不是图标直接裸放在卡片上。
- Hover/长按编辑态：elevation 从 level 1 → level 3，配合 `standard` 缓动的位移动画（轻微上浮 2px）。
- 网格间距统一用第 3 节的 8dp 基线（建议卡片间距 12–16px）。

### 5.3 时钟 / 天气组件
- 作为页面视觉锚点，可以用 `display-large` / `display-medium` 字号，但颜色必须是 `on-surface`（不要用 primary 强调色铺满大字，容易在浅色壁纸上糊掉）。
- 天气卡片：`surface-container` + `outline-variant` 细边框（1px），不要用重投影，M3 更依赖色彩分层而非投影区分层级。

### 5.4 设置面板（抽屉/弹层）
- 这是当前最容易"露馅"的地方——如果设置面板还是 Naive UI 默认的 `n-drawer` 样式，会和主页面的 M3 风格割裂明显。必须通过 `theme-overrides` 重写 `Drawer`、`Modal`、`Switch`、`Slider`、`Select` 等组件的圆角、色彩、间距。
- 背景：`surface-container-highest`，配合 M3 标准的 scrim 遮罩（黑色 32% 透明度，而非当前可能的纯模糊无遮罩）。
- 分区用 `title-large` 做小节标题，选项用 `body-large` + M3 风格的 `Switch`（药丸形滑块，非方形）。

### 5.5 Naive UI 主题覆盖（技术实现要点）

这是整个重构能否"看起来统一"的技术核心。Naive UI 提供 `theme-overrides` API，Agent 应该：

```js
// src/style/naive-theme.js
export function buildNaiveThemeOverrides(tokens) {
  return {
    common: {
      primaryColor: tokens.primary,
      primaryColorHover: tokens.primaryContainer,
      borderRadius: tokens.shapeMedium, // 12px
      fontFamily: tokens.fontFamily,
    },
    Button: {
      borderRadiusMedium: tokens.shapeFull, // M3 按钮是药丸形
      colorPrimary: tokens.primary,
      textColorPrimary: tokens.onPrimary,
    },
    Card: {
      borderRadius: tokens.shapeLarge,
      color: tokens.surfaceContainerHigh,
    },
    Drawer: {
      color: tokens.surfaceContainerHighest,
    },
    // ...对每个用到的组件逐一覆盖
  };
}
```
把 `material-color-utilities` 生成的动态色 token，实时喂给这个函数，挂在 `<n-config-provider :theme-overrides="...">` 上，做到"取色引擎"和"Naive UI 皮肤"单向同步，杜绝两套色彩系统并存。

---

## 6. 深色模式（Dark Mode）

- Light/Dark 两套 Scheme 必须都由同一个 seed color 通过 `DynamicScheme` 生成，不要用"简单反色"或"降低亮度"这种取巧做法，否则深色模式下对比度和色彩关系会跑偏。
- 深色模式下 `surface` 系列应该整体偏暗但不是纯黑（M3 建议深色 surface 基准在 `#141218` 附近），Elevation 的"色调叠加"在深色模式下更明显（level 越高，叠加的 primary 色越多，这是深色模式下区分层级的主要手段，阴影本身在深色背景上几乎不可见）。
- 跟随系统（`prefers-color-scheme`）+ 手动切换开关两者都要支持，当前 README 已提到有这个功能，重构时保证两套模式共享同一份 token 命名，只是取值不同。

---

## 7. 响应式与移动端

- 断点建议：`<600px` 手机、`600–905px` 小平板、`>905px` 桌面（M3 官方断点）。
- 移动端：搜索框、快捷方式网格全宽自适应，设置面板从"侧边 Drawer"改为"底部 Bottom Sheet"（M3 移动端惯例），圆角只取顶部两角为 `extra-large`。
- 触控目标最小 48x48px（图标按钮、快捷方式点击区域都要检查是否达标，当前如果是从 SNav 直接改的，很可能图标按钮偏小）。

---

## 8. 给 Agent 的实施顺序（建议按此顺序提交多个小 PR，而不是一次性重写）

1. **建立 Token 层**：新建 `src/style/_md-tokens.scss`（静态 shape/spacing/motion/typography token）+ `src/utils/theme.js`（基于 seed color 动态生成色彩 token 并写入 CSS variables）。此阶段不改任何组件，先把"地基"打好。
2. **接管 Naive UI**：实现第 5.5 节的 `theme-overrides`，全局替换 `n-config-provider` 的主题配置，此时页面会出现明显的"整体感"提升，即使组件内部样式还没细调。
3. **重构原子组件**：按 5.1–5.4 节顺序，逐个改造搜索框、快捷方式卡片、时钟/天气、设置面板，每改完一个模块截图对比，确认圆角/色彩/间距是否都来自 Token。
4. **处理背景/壁纸模式的取舍**（第 2.3 节的方案 A 或 B，需要你/用户先拍板选哪个）。
5. **动效收尾**：统一 `transition`，替换默认缓动曲线为 M3 标准曲线。
6. **深色模式校验**：切换到 Dark，走一遍全部页面和面板，检查 Elevation tint 是否生效、对比度是否达标（正文文字对比度 ≥ 4.5:1）。
7. **响应式与触控目标校验**：用移动端视口过一遍，检查断点、Bottom Sheet、触控区域。
8. **最终一致性 QA**（见第 9 节 checklist）。

---

## 9. 验收 Checklist（重构完成后逐条勾选）

- [ ] 页面中不存在任何写死的十六进制颜色值，所有颜色来自 `--md-sys-color-*` 变量
- [ ] 所有圆角只使用第 3 节定义的 7 档 shape token
- [ ] 卡片层级关系清晰可辨：背景 < 一级组件 < 二级卡片 < 弹层（对照第 2.2 节分层规则）
- [ ] Naive UI 组件（Drawer/Modal/Switch/Select/Button 等）与自定义组件在圆角、配色上视觉一致，用户看不出"这是组件库默认的、那是手写的"
- [ ] 字号只使用第 4 节定义的 Type Scale，没有游离字号
- [ ] 深色模式下对比度达标，Elevation 靠色调叠加而非纯阴影区分
- [ ] 壁纸模式（如果保留）明确遵循第 2.3 节选定的方案，未退回无约束的旧玻璃拟态
- [ ] 动效统一使用 M3 缓动曲线，无默认 `ease`/`linear` 残留
- [ ] 移动端触控目标 ≥ 48px，断点行为符合第 7 节
- [ ] 用五句话以内能向非设计师描述清楚"现在的视觉规则是什么"——如果说不清楚，说明系统还不够收敛

---

## 参考资料
- Material Design 3 官方规范：https://m3.material.io/
- Material Color Utilities（项目已使用）：https://github.com/material-foundation/material-color-utilities
- Naive UI 主题定制文档：https://www.naiveui.com/zh-CN/os-theme/docs/customize-theme
