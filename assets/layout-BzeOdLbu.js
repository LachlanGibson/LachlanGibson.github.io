import{R as v,p as t,t as c,a as o,v as w,w as N,O as z}from"./chunk-UVKPFVEO-CNSXAMsK.js";import{u as E,a as T,P as _,b as P,C as S,c as L,d as M,T as C}from"./componentbase.esm-vWkvxOcA.js";import{I as R}from"./IconLinks-922oeyqP.js";import{l as D}from"./theme-C9CHQPPR.js";const H="/assets/theme-DwPuzdRA.css",p=({isActive:n})=>`border-b-2 pb-0.5 text-sm font-semibold tracking-[0.02em] whitespace-nowrap text-(--site-text) no-underline transition-colors ${n?"border-(--site-link)":"border-transparent hover:border-(--site-border)"}`,I=()=>{const{mode:n,toggleTheme:i}=E(),[e,a]=v.useState(!1);v.useEffect(()=>{a(!0)},[]);const r=e?n:"light";return t.jsxs("nav",{className:"flex min-h-12 items-center px-3 py-4 text-(--site-text) sm:px-4",children:[t.jsxs("div",{className:"mr-auto flex items-center gap-3",children:[t.jsx("img",{src:"/navbar/icons/LG_logo.svg",alt:"Logo for Lachlan Gibson's website",className:"h-7 w-7"}),t.jsx("span",{className:"text-sm font-medium tracking-[0.01em] max-[460px]:hidden",children:"lachlangibson.dev"})]}),t.jsxs("div",{className:"flex items-center gap-5 max-[580px]:gap-3",children:[t.jsx(c,{className:p,to:"/",children:"Home"}),t.jsx(c,{className:p,to:"/about/",children:"About"}),t.jsx(c,{className:p,to:"/articles/",children:"Articles"}),t.jsx("button",{type:"button",onClick:i,className:`relative h-7 w-[3.9rem] rounded-full border border-(--site-border) p-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.16),0_3px_8px_rgba(0,0,0,0.16)] transition-all duration-300 hover:border-(--site-link) ${r==="dark"?"bg-linear-to-br from-[#364a6b] to-[#1e2c44]":"bg-linear-to-br from-(--site-surface-alt) to-(--site-surface)"}`,"aria-label":`Switch to ${r==="dark"?"light":"dark"} mode`,title:`Switch to ${r==="dark"?"light":"dark"} mode`,children:t.jsx("span",{"aria-hidden":"true",className:`absolute top-1/2 left-[0.14rem] grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-sm leading-none font-bold shadow-[0_1px_2px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.22)] transition-all duration-300 ${r==="dark"?"translate-x-[2.1rem] bg-[#121a2a] text-[#e7edf8]":"bg-[#f8fafc] text-[#f4c93f]"}`,children:r==="dark"?"☾":"☀"})})]})]})};var A={root:function(i){var e=i.props,a=i.horizontal,r=i.vertical;return L("p-divider p-component p-divider-".concat(e.layout," p-divider-").concat(e.type),{"p-divider-left":a&&(!e.align||e.align==="left"),"p-divider-right":a&&e.align==="right","p-divider-center":a&&e.align==="center"||r&&(!e.align||e.align==="center"),"p-divider-top":r&&e.align==="top","p-divider-bottom":r&&e.align==="bottom"},e.className)},content:"p-divider-content"},$=`
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
`,B={root:function(i){var e=i.props;return{justifyContent:e.layout==="horizontal"?e.align==="center"||e.align===null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align===null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null}}},d=S.extend({defaultProps:{__TYPE:"Divider",align:null,layout:"horizontal",type:"solid",style:null,className:null,children:void 0},css:{classes:A,styles:$,inlineStyles:B}}),h=o.forwardRef(function(n,i){var e=T(),a=o.useContext(_),r=d.getProps(n,a),l=d.setMetaData({props:r}),s=l.ptm,m=l.cx,x=l.sx,g=l.isUnstyled;P(d.css.styles,g,{name:"divider"});var f=o.useRef(null),b=r.layout==="horizontal",y=r.layout==="vertical";o.useImperativeHandle(i,function(){return{props:r,getElement:function(){return f.current}}});var j=e({ref:f,style:x("root"),className:m("root",{horizontal:b,vertical:y}),"aria-orientation":r.layout,role:"separator"},d.getOtherProps(r),s("root")),k=e({className:m("content")},s("content"));return o.createElement("div",j,o.createElement("div",k,r.children))});h.displayName="Divider";const G=()=>{const n=new Date().getFullYear();return t.jsxs("footer",{className:"p-4",children:[t.jsx(h,{}),t.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[t.jsxs("span",{className:"text-sm text-(--site-text-muted)",children:["©"," ",n," Lachlan Gibson"]}),t.jsx(R,{})]})]})};function O(){const{pathname:n}=w();return o.useEffect(()=>{window.scrollTo(0,0)},[n]),null}const u="lachlan-theme-mode",Y=()=>window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",F=n=>{const i=document.documentElement;i.dataset.theme=n,i.classList.toggle("app-dark",n==="dark");const e=document.querySelector('meta[name="theme-color"]');e&&e.setAttribute("content",n==="dark"?"#182536":"#f8fbff");const a=document.getElementById("app-theme");a&&a.setAttribute("href",n==="dark"?H:D)},U=({children:n})=>{const[i,e]=o.useState(()=>{if(typeof window>"u")return"light";const s=localStorage.getItem(u);return s==="light"||s==="dark"?s:Y()}),a=o.useMemo(()=>i,[i]);o.useEffect(()=>{localStorage.setItem(u,i)},[i]),o.useEffect(()=>{F(a)},[a]);const r=s=>{e(s)},l=()=>{e(s=>s==="dark"?"light":"dark")};return t.jsx(M,{children:t.jsx(C.Provider,{value:{mode:i,resolvedTheme:a,setMode:r,toggleTheme:l},children:n})})},W=N(function(){return t.jsxs(U,{children:[t.jsx(O,{}),t.jsxs("div",{className:"flex min-h-dvh flex-col",children:[t.jsx(I,{}),t.jsx("main",{className:"flex-1",children:t.jsx(z,{})}),t.jsx(G,{})]})]})});export{W as default};
