"use strict";var b=Object.defineProperty;var Y=Object.getOwnPropertyDescriptor;var Z=Object.getOwnPropertyNames;var ee=Object.prototype.hasOwnProperty;var M=(e,t)=>{for(var r in t)b(e,r,{get:t[r],enumerable:!0})},te=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Z(t))!ee.call(e,o)&&o!==r&&b(e,o,{get:()=>t[o],enumerable:!(n=Y(t,o))||n.enumerable});return e};var re=e=>te(b({},"__esModule",{value:!0}),e);var we={};M(we,{App:()=>p,Button:()=>W,FlexBox:()=>I,FlexChild:()=>z,Spinner:()=>m,utils:()=>q});module.exports=re(we);var ut=require("dev-only:preact/debug");var f=require("preact"),k=require("preact/jsx-runtime"),oe=document.head.parentElement,E=oe.querySelector(":scope > body"),U=!1,p=class extends f.Component{render(){return this.props.children}static create(t){U||(E.innerHTML="",U=!0,(0,f.render)((0,k.jsx)(p,{children:t}),E))}};var ne=Object.defineProperty,ie=Object.getOwnPropertyDescriptor,P=(e,t,r,n)=>{for(var o=n>1?void 0:n?ie(t,r):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(o=(n?a(t,r,o):a(o))||o);return n&&o&&ne(t,r,o),o};function B(e){return(t,r)=>{Object.defineProperty(t,"name",{value:e})}}function u(e,t){return Object.defineProperty(t,"name",{value:e}),t}var S="__uc_globals";globalThis[S]||Object.defineProperty(globalThis,S,{enumerable:!1,configurable:!1,writable:!1,value:Object.create(null)});function L(e,t){let r=globalThis[S];return e in r?r[e]:r[e]=t()}var j=L("utility",()=>Symbol()),d=L("utilityStore",()=>new WeakMap),F=L("utilityState",()=>({isLoaded:!1})),Pe=u("isUtility",e=>!!e?.[j]),Be=u("createUtility",(e,t)=>({[j]:!0,implements:e,implementation:t})),Le=u("loadUtilities",async(...e)=>{let t=[];for(let r of e){let n=new r.implementation,o=n.init().then(()=>(d.set(r.implements,n),n));t.push(o),d.set(r.implements,o)}await Promise.all(t),F.isLoaded=!0}),D=u("getUtility",e=>Promise.resolve(d.get(e))),De=u("useUtil",e=>{if(!F.isLoaded)throw new Error("Can't call useUtil hook before utilities fully loaded");return d.get(e)}),h=class{};h=P([B("Initializable")],h);var N=(e=>(e.dark="dark",e.light="light",e))(N||{}),se={Theme:N},c=class extends h{changeListeners={};options={};enums=se;emitChange(e,t){this.changeListeners[e]&&this.changeListeners[e].forEach(r=>{let{once:n}=this.options[e].get(r);n&&(this.changeListeners[e].delete(r),this.options[e].delete(r));try{r(t)}catch(o){console.error(o)}})}onChange(e,t,r){this.changeListeners[e]??=new Set,this.options[e]??=new WeakMap,this.changeListeners[e].add(t),this.options[e].set(t,r||{})}offChange(e,t){this.changeListeners[e]&&(this.changeListeners[e].delete(t),this.options[e].delete(t))}};c=P([B("LocalDB")],c);var w=class extends h{async init(){let e=await D(c);try{await e.get("theme")}catch{await e.set("theme",await this.getDefault())}}};w=P([B("ColorScheme")],w);function ae(e,t,...r){return Object.assign(Object.defineProperty(t,"name",{value:e}),...r)}var l=u("Component",ae);var H=require("preact/compat");var v={flexbox:"_flexbox_l45iq_1",row:"_row_l45iq_5","row-reverse":"_row-reverse_l45iq_9",column:"_column_l45iq_13","column-reverse":"_column-reverse_l45iq_17",nowrap:"_nowrap_l45iq_21",wrap:"_wrap_l45iq_25","wrap-reverse":"_wrap-reverse_l45iq_29"};var J=require("preact/jsx-runtime"),V=(o=>(o.row="row",o.rowReverse="rowReverse",o.column="column",o.columnReverse="columnReverse",o))(V||{}),G=(n=>(n.nowrap="nowrap",n.wrap="wrap",n.wrapReverse="wrapReverse",n))(G||{});function le(...e){return e.filter(t=>t).join(" ")}var I=l("FlexBox",(0,H.forwardRef)(({children:e,direction:t="row",wrap:r="nowrap"},n)=>(0,J.jsx)("div",{class:le(v.flexbox,v[t],v[r]),ref:n,children:e})),{Direction:V,Wrap:G});var g=require("preact/hooks"),y=require("preact/jsx-runtime"),z=l("FlexChild",({children:e,basis:t,grow:r,shrink:n,ref:o})=>{let i=o||(0,g.useRef)();if((0,g.useEffect)(()=>{if(!i?.current)return;let s=i.current;s.style.flexBasis=String(t),s.style.flexGrow=String(r),s.style.flexShrink=String(n)},[i]),typeof e!="object")throw new Error("FlexChild should have exactly 1 DOM element in children. Found the only non-DOM child");let[a]=Array.isArray(e)?e:[e];return a.props.ref=i,(0,y.jsx)(y.Fragment,{children:a})});var Q=require("preact/compat"),_=require("preact/hooks");var A=require("preact/compat");var $={spinner:"_spinner_um281_39",rotator:"_rotator_um281_1",path:"_path_um281_43","variant-colorful":"_variant-colorful_um281_49",dash:"_dash_um281_1",colors:"_colors_um281_1","variant-monotone":"_variant-monotone_um281_53"};var T=require("preact/jsx-runtime"),{spinner:ce,path:pe,variantColorful:ue,variantMonotone:me}=$,X=(r=>(r[r.monotone=0]="monotone",r[r.colorful=1]="colorful",r))(X||{}),fe={[0]:me,[1]:ue},m=l("Spinner",(0,A.forwardRef)(({variant:e=1,class:t,style:r},n)=>(0,T.jsx)("svg",{class:`${t} ${ce} ${fe[e]}`,width:"100%",height:"100%",viewBox:"0 0 66 66",xmlns:"http://www.w3.org/2000/svg",style:r,ref:n,children:(0,T.jsx)("circle",{class:pe,fill:"none","stroke-width":"10","stroke-linecap":"round",cx:"33",cy:"33",r:"30"})})),{Variant:X});var K={button:"_button_1wlm7_1",spinner:"_spinner_1wlm7_18"};var x=require("preact/jsx-runtime"),{button:de,spinner:he}=K,W=l("Button",(0,Q.forwardRef)(({onClick:e,children:t},r)=>{let[n,o]=(0,_.useState)(!1),i=(0,_.useCallback)(async()=>{o(!0),await e(),o(!1)},[o]);return(0,x.jsxs)("button",{class:de,onClick:i,disabled:n,ref:r,children:[t,(0,x.jsx)(m,{variant:m.Variant.monotone,class:he,style:{opacity:n?1:0}})]})}));var q={};M(q,{ClolorSchemeWebImpl:()=>R,LocalDBWebImpl:()=>O});var C="kv",O=class extends c{db;runTransaction(t,r){return new Promise(async(n,o)=>{let a=this.db.transaction(C,t?"readonly":"readwrite").objectStore(C),s=await r(a);s.onerror=()=>{s.onsuccess=null,s.onerror=null,o(s.error)},s.onsuccess=()=>{s.onsuccess=null,s.onerror=null,n(s.result)}})}async init(){await new Promise((t,r)=>{let n="main",o=indexedDB.open(n,1);o.onupgradeneeded=function(){let i=o.result;i.objectStoreNames.contains(C)||i.createObjectStore(C,{keyPath:"key"})},o.onerror=()=>{o.onupgradeneeded=null,o.onerror=null,o.onsuccess=null,r(o.error)},o.onsuccess=()=>{o.onupgradeneeded=null,o.onerror=null,o.onsuccess=null,this.db=o.result,t()}})}async get(t){return await this.runTransaction(!0,r=>r.get(t))}async set(t,r){let n=JSON.parse(JSON.stringify(r));await this.runTransaction(!1,o=>o.put(n,t)),this.emitChange(t,n)}async delete(t){await this.runTransaction(!1,r=>r.delete(t)),this.emitChange(t,void 0)}};var R=class extends w{async getDefault(){let t=await D(c),{Theme:r}=t.enums;return matchMedia("prefers-color-scheme: light").matches?r.light:r.dark}};0&&(module.exports={App,Button,FlexBox,FlexChild,Spinner,utils});
//# sourceMappingURL=index.cjs.map