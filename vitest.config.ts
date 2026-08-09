import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['app/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      // 门禁范围 = 纯逻辑层（app/lib）。UI 组件（components/**）与路由（routes/**）不计入
      // ——文件级覆盖率统计的是文件而非函数，混入 UI 会失真。
      include: ['app/lib/**'],
      // 排除依赖外部环境/纯工具：env.server 依赖 process.env（node 下模拟成本高），
      // cn 为 tailwind-merge 薄封装（逻辑已被 tailwind-merge 自身测试覆盖）。
      exclude: [
        'app/lib/env.server.ts',
        'app/lib/utils.ts',
      ],
      // 起步保守阈值：门禁先「有」再「高」，测试规模上来后可上调（详见 docs/planning/backlog.md）。
      thresholds: {
        lines: 55,
        functions: 55,
        statements: 55,
      },
    },
  },
})
