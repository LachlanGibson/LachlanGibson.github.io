import{a,R as v,p as t,t as c,v as N,w as z,O as E}from"./chunk-LFPYN7LY-xNvBvHUo.js";import{u as T,P,a as _,C as S,c as C,b as L}from"./componentbase.esm-BrXJsO-f.js";import{I as M}from"./IconLinks-hAsCgtTv.js";import{l as R}from"./theme-C9CHQPPR.js";const D="/assets/theme-DwPuzdRA.css",h=a.createContext(void 0),H=()=>{const n=a.useContext(h);if(!n)throw new Error("useTheme must be used within ThemeProvider");return n},p=({isActive:n})=>`border-b-2 pb-0.5 text-sm font-semibold tracking-[0.02em] whitespace-nowrap text-(--site-text) no-underline transition-colors ${n?"border-(--site-link)":"border-transparent hover:border-(--site-border)"}`,I=()=>{const{mode:n,toggleTheme:i}=H(),[e,o]=v.useState(!1);v.useEffect(()=>{o(!0)},[]);const r=e?n:"light";return t.jsxs("nav",{className:"flex min-h-12 items-center px-3 py-4 text-(--site-text) sm:px-4",children:[t.jsxs("div",{className:"mr-auto flex items-center gap-3",children:[t.jsx("img",{src:"/navbar/icons/LG_logo.svg",alt:"Logo for Lachlan Gibson's website",className:"h-7 w-7"}),t.jsx("span",{className:"text-sm font-medium tracking-[0.01em] max-[460px]:hidden",children:"lachlangibson.dev"})]}),t.jsxs("div",{className:"flex items-center gap-5 max-[580px]:gap-3",children:[t.jsx(c,{className:p,to:"/",children:"Home"}),t.jsx(c,{className:p,to:"/about/",children:"About"}),t.jsx(c,{className:p,to:"/articles/",children:"Articles"}),t.jsx("button",{type:"button",onClick:i,className:`relative h-7 w-[3.9rem] rounded-full border border-(--site-border) p-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.16),0_3px_8px_rgba(0,0,0,0.16)] transition-all duration-300 hover:border-(--site-link) ${r==="dark"?"bg-linear-to-br from-[#364a6b] to-[#1e2c44]":"bg-linear-to-br from-(--site-surface-alt) to-(--site-surface)"}`,"aria-label":`Switch to ${r==="dark"?"light":"dark"} mode`,title:`Switch to ${r==="dark"?"light":"dark"} mode`,children:t.jsx("span",{"aria-hidden":"true",className:`absolute top-1/2 left-[0.14rem] grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-sm leading-none font-bold shadow-[0_1px_2px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${r==="dark"?"translate-x-[2.1rem] bg-[#121a2a] text-[#e7edf8]":"bg-[#f8fafc] text-[#f4c93f]"}`,children:r==="dark"?"☾":"☀"})})]})]})};var A={root:function(i){var e=i.props,o=i.horizontal,r=i.vertical;return C("p-divider p-component p-divider-".concat(e.layout," p-divider-").concat(e.type),{"p-divider-left":o&&(!e.align||e.align==="left"),"p-divider-right":o&&e.align==="right","p-divider-center":o&&e.align==="center"||r&&(!e.align||e.align==="center"),"p-divider-top":r&&e.align==="top","p-divider-bottom":r&&e.align==="bottom"},e.className)},content:"p-divider-content"},$=`
@layer primereact {
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
    }
    
    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        top: 50%;
        left: 0;
        width: 100%;
        content: "";
    }
    
    .p-divider-horizontal.p-divider-left {
        justify-content: flex-start;
    }
    
    .p-divider-horizontal.p-divider-right {
        justify-content: flex-end;
    }
    
    .p-divider-horizontal.p-divider-center {
        justify-content: center;
    }
    
    .p-divider-content {
        z-index: 1;
    }
    
    .p-divider-vertical {
        min-height: 100%;
        margin: 0 1rem;
        display: flex;
        position: relative;
        justify-content: center;
    }
    
    .p-divider-vertical:before {
        position: absolute;
        display: block;
        top: 0;
        left: 50%;
        height: 100%;
        content: "";
    }
    
    .p-divider-vertical.p-divider-top {
        align-items: flex-start;
    }
    
    .p-divider-vertical.p-divider-center {
        align-items: center;
    }
    
    .p-divider-vertical.p-divider-bottom {
        align-items: flex-end;
    }
    
    .p-divider-solid.p-divider-horizontal:before {
        border-top-style: solid;
    }
    
    .p-divider-solid.p-divider-vertical:before {
        border-left-style: solid;
    }
    
    .p-divider-dashed.p-divider-horizontal:before {
        border-top-style: dashed;
    }
    
    .p-divider-dashed.p-divider-vertical:before {
        border-left-style: dashed;
    }
    
    .p-divider-dotted.p-divider-horizontal:before {
        border-top-style: dotted;
    }
    
    .p-divider-dotted.p-divider-horizontal:before {
        border-left-style: dotted;
    }
}
`,B={root:function(i){var e=i.props;return{justifyContent:e.layout==="horizontal"?e.align==="center"||e.align===null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align===null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null}}},d=S.extend({defaultProps:{__TYPE:"Divider",align:null,layout:"horizontal",type:"solid",style:null,className:null,children:void 0},css:{classes:A,styles:$,inlineStyles:B}}),x=a.forwardRef(function(n,i){var e=T(),o=a.useContext(P),r=d.getProps(n,o),l=d.setMetaData({props:r}),s=l.ptm,m=l.cx,g=l.sx,b=l.isUnstyled;_(d.css.styles,b,{name:"divider"});var u=a.useRef(null),y=r.layout==="horizontal",j=r.layout==="vertical";a.useImperativeHandle(i,function(){return{props:r,getElement:function(){return u.current}}});var k=e({ref:u,style:g("root"),className:m("root",{horizontal:y,vertical:j}),"aria-orientation":r.layout,role:"separator"},d.getOtherProps(r),s("root")),w=e({className:m("content")},s("content"));return a.createElement("div",k,a.createElement("div",w,r.children))});x.displayName="Divider";const G=()=>{const n=new Date().getFullYear();return t.jsxs("footer",{className:"p-4",children:[t.jsx(x,{}),t.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[t.jsxs("span",{className:"text-sm text-(--site-text-muted)",children:["©"," ",n," Lachlan Gibson"]}),t.jsx(M,{})]})]})};function O(){const{pathname:n}=N();return a.useEffect(()=>{window.scrollTo(0,0)},[n]),null}const f="lachlan-theme-mode",Y=()=>window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",F=n=>{const i=document.documentElement;i.dataset.theme=n,i.classList.toggle("app-dark",n==="dark");const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",n==="dark"?"#182536":"#f8fbff");const o=document.getElementById("app-theme");o&&o.setAttribute("href",n==="dark"?D:R)},U=({children:n})=>{const[i,e]=a.useState(()=>{if(typeof window>"u")return"light";const s=localStorage.getItem(f);return s==="light"||s==="dark"?s:Y()}),o=a.useMemo(()=>i,[i]);a.useEffect(()=>{localStorage.setItem(f,i)},[i]),a.useEffect(()=>{F(o)},[o]);const r=s=>{e(s)},l=()=>{e(s=>s==="dark"?"light":"dark")};return t.jsx(L,{children:t.jsx(h.Provider,{value:{mode:i,resolvedTheme:o,setMode:r,toggleTheme:l},children:n})})},W=z(function(){return t.jsxs(U,{children:[t.jsx(O,{}),t.jsxs("div",{className:"flex min-h-dvh flex-col",children:[t.jsx(I,{}),t.jsx("main",{className:"flex-1",children:t.jsx(E,{})}),t.jsx(G,{})]})]})});export{W as default};
