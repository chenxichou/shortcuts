// shims-vue.d.ts is a declaration file that tells TypeScript how to handle .vue files
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}