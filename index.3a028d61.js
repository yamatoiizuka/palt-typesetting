function e(e){return e&&e.__esModule?e.default:e}s=document,i={kitId:"jgt3rhh",scriptTimeout:3e3,async:!0},o=s.documentElement,c=setTimeout(function(){o.className=o.className.replace(/\bwf-loading\b/g,"")+" wf-inactive"},i.scriptTimeout),u=s.createElement("script"),l=!1,h=s.getElementsByTagName("script")[0],o.className+=" wf-loading",u.src="https://use.typekit.net/"+i.kitId+".js",u.async=!0,u.onload=u.onreadystatechange=function(){if(a=this.readyState,!l&&(!a||"complete"==a||"loaded"==a)){l=!0,clearTimeout(c);try{Typekit.load(i)}catch(e){}}},h.parentNode.insertBefore(u,h);const t=window,n=e=>new t.DOMParser().parseFromString(e,"text/html"),r=e=>{let n=t.document.createTreeWalker(e,t.NodeFilter.SHOW_TEXT),r=n.nextNode(),s=[];for(;r;)r.nodeValue&&""!==r.nodeValue.trim()&&s.push(r),r=n.nextNode();return s};var s,a,i,o,c,u,l,h,d=class{constructor(e,n){this.replaceNode=(e,n)=>{let r=t.document.createRange();r.selectNode(e);let s=r.createContextualFragment(n);e.parentNode&&(e.parentNode.insertBefore(s,e),e.parentNode.removeChild(e))},this.transformFunctions=e,this.options=n}processHtmlWithFunctions(e){return""===e?e:this.transformFunctions.reduce((e,t)=>this.processHtml(e,t),e)}processHtml(e,t){if(""===e)return e;let s=n(e),a=r(s.body);return a.forEach((e,n)=>{let r=a[n+1]||null,s=this.getTransformedHtml(e,r,t);this.replaceNode(e,s)}),s.body.innerHTML}getTransformedHtml(e,t,n){return n(e.nodeValue||"",t&&t.nodeValue||"",this.options)}},f={},p={};function g(){this.table=new Uint16Array(16),this.trans=new Uint16Array(288)}function b(e,t){this.source=e,this.sourceIndex=0,this.tag=0,this.bitcount=0,this.dest=t,this.destLen=0,this.ltree=new g,this.dtree=new g}var v=new g,m=new g,y=new Uint8Array(30),w=new Uint16Array(30),A=new Uint8Array(30),L=new Uint16Array(30),k=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),B=new g,S=new Uint8Array(320);function x(e,t,n,r){var s,a;for(s=0;s<n;++s)e[s]=0;for(s=0;s<30-n;++s)e[s+n]=s/n|0;for(a=r,s=0;s<30;++s)t[s]=a,a+=1<<e[s]}var H=new Uint16Array(16);function P(e,t,n,r){var s,a;for(s=0;s<16;++s)e.table[s]=0;for(s=0;s<r;++s)e.table[t[n+s]]++;for(a=0,e.table[0]=0,s=0;s<16;++s)H[s]=a,a+=e.table[s];for(s=0;s<r;++s)t[n+s]&&(e.trans[H[t[n+s]]++]=s)}function T(e,t,n){if(!t)return n;for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;var r=e.tag&65535>>>16-t;return e.tag>>>=t,e.bitcount-=t,r+n}function X(e,t){for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;var n=0,r=0,s=0,a=e.tag;do r=2*r+(1&a),a>>>=1,++s,n+=t.table[s],r-=t.table[s];while(r>=0)return e.tag=a,e.bitcount-=s,t.trans[n+r]}function W(e,t,n){for(;;){var r,s,a,i,o=X(e,t);if(256===o)return 0;if(o<256)e.dest[e.destLen++]=o;else for(o-=257,r=T(e,y[o],w[o]),s=X(e,n),i=a=e.destLen-T(e,A[s],L[s]);i<a+r;++i)e.dest[e.destLen++]=e.dest[i]}}!function(e,t){var n;for(n=0;n<7;++n)e.table[n]=0;for(n=0,e.table[7]=24,e.table[8]=152,e.table[9]=112;n<24;++n)e.trans[n]=256+n;for(n=0;n<144;++n)e.trans[24+n]=n;for(n=0;n<8;++n)e.trans[168+n]=280+n;for(n=0;n<112;++n)e.trans[176+n]=144+n;for(n=0;n<5;++n)t.table[n]=0;for(n=0,t.table[5]=32;n<32;++n)t.trans[n]=n}(v,m),x(y,w,4,3),x(A,L,2,1),y[28]=0,w[28]=258,p=function(e,t){var n,r,s=new b(e,t);do{switch(n=function(e){e.bitcount--||(e.tag=e.source[e.sourceIndex++],e.bitcount=7);var t=1&e.tag;return e.tag>>>=1,t}(s),T(s,2,0)){case 0:r=function(e){for(var t,n;e.bitcount>8;)e.sourceIndex--,e.bitcount-=8;if((t=256*(t=e.source[e.sourceIndex+1])+e.source[e.sourceIndex])!==(65535&~(256*e.source[e.sourceIndex+3]+e.source[e.sourceIndex+2])))return -3;for(e.sourceIndex+=4,n=t;n;--n)e.dest[e.destLen++]=e.source[e.sourceIndex++];return e.bitcount=0,0}(s);break;case 1:r=W(s,v,m);break;case 2:(function(e,t,n){for(i=0,r=T(e,5,257),s=T(e,5,1),a=T(e,4,4);i<19;++i)S[i]=0;for(i=0;i<a;++i){var r,s,a,i,o,c,u=T(e,3,0);S[k[i]]=u}for(P(B,S,0,19),o=0;o<r+s;){var l=X(e,B);switch(l){case 16:var h=S[o-1];for(c=T(e,2,3);c;--c)S[o++]=h;break;case 17:for(c=T(e,3,3);c;--c)S[o++]=0;break;case 18:for(c=T(e,7,11);c;--c)S[o++]=0;break;default:S[o++]=l}}P(t,S,0,r),P(n,S,r,s)})(s,s.ltree,s.dtree),r=W(s,s.ltree,s.dtree);break;default:r=-3}if(0!==r)throw Error("Data error")}while(!n)return s.destLen<s.dest.length?"function"==typeof s.dest.slice?s.dest.slice(0,s.destLen):s.dest.subarray(0,s.destLen):s.dest};const z=18===new Uint8Array(new Uint32Array([305419896]).buffer)[0],N=(e,t,n)=>{let r=e[t];e[t]=e[n],e[n]=r},I=e=>{let t=e.length;for(let n=0;n<t;n+=4)N(e,n,n+3),N(e,n+1,n+2)};var U=e=>{z&&I(e)};f=class{constructor(e){let t="function"==typeof e.readUInt32BE&&"function"==typeof e.slice;if(t||e instanceof Uint8Array){let n;if(t)this.highStart=e.readUInt32LE(0),this.errorValue=e.readUInt32LE(4),n=e.readUInt32LE(8),e=e.slice(12);else{let t=new DataView(e.buffer);this.highStart=t.getUint32(0,!0),this.errorValue=t.getUint32(4,!0),n=t.getUint32(8,!0),e=e.subarray(12)}e=p(e,new Uint8Array(n)),U(e=p(e,new Uint8Array(n))),this.data=new Uint32Array(e.buffer)}else({data:this.data,highStart:this.highStart,errorValue:this.errorValue}=e)}get(e){let t;return e<0||e>1114111?this.errorValue:e<55296||e>56319&&e<=65535?(t=(this.data[e>>5]<<2)+(31&e),this.data[t]):e<=65535?(t=(this.data[2048+(e-55296>>5)]<<2)+(31&e),this.data[t]):e<this.highStart?(t=this.data[2080+(e>>11)],t=((t=this.data[t+(e>>5&63)])<<2)+(31&e),this.data[t]):this.data[this.data.length-4]}};var V={};!function(e){var t="undefined"!=typeof Uint8Array?Uint8Array:Array;function n(e){var t=e.charCodeAt(0);return 43===t||45===t?62:47===t||95===t?63:t<48?-1:t<58?t-48+26+26:t<91?t-65:t<123?t-97+26:void 0}e.toByteArray=function(e){if(e.length%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r,s,a,i,o,c,u=e.length;o="="===e.charAt(u-2)?2:"="===e.charAt(u-1)?1:0,c=new t(3*e.length/4-o),a=o>0?e.length-4:e.length;var l=0;function h(e){c[l++]=e}for(r=0,s=0;r<a;r+=4,s+=3)h((16711680&(i=n(e.charAt(r))<<18|n(e.charAt(r+1))<<12|n(e.charAt(r+2))<<6|n(e.charAt(r+3))))>>16),h((65280&i)>>8),h(255&i);return 2===o?h(255&(i=n(e.charAt(r))<<2|n(e.charAt(r+1))>>4)):1===o&&(h((i=n(e.charAt(r))<<10|n(e.charAt(r+1))<<4|n(e.charAt(r+2))>>2)>>8&255),h(255&i)),c},e.fromByteArray=function(e){var t,n,r,s,a=e.length%3,i="";function o(e){return"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)}for(n=0,s=e.length-a;n<s;n+=3)i+=o((t=r=(e[n]<<16)+(e[n+1]<<8)+e[n+2])>>18&63)+o(t>>12&63)+o(t>>6&63)+o(63&t);switch(a){case 1:i+=o((r=e[e.length-1])>>2)+o(r<<4&63)+"==";break;case 2:i+=o((r=(e[e.length-2]<<8)+e[e.length-1])>>10)+o(r>>4&63)+o(r<<2&63)+"="}return i}}(V);var C={};const E=[[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4],[0,4,4,1,1,4,4,4,4,1,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,4,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[4,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,1],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,1],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,1,0,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,0,0,1,1,1,1,1,1,1,0,0,4,2,4,1,1,1,1,1,0,1,1,1,0],[1,4,4,1,1,1,4,4,4,0,0,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,0,1,4,4,4,0,0,1,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,0,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,4,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,1],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,1,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,1,1,1,1,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,1,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,1,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,1,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0]],O=e(V).toByteArray("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"),j=new(e(f))(O),F=function(e){switch(e){case 33:case 39:case 40:case 42:return 12;case 35:return 5;default:return e}},D=function(e){switch(e){case 37:case 38:return 34;case 41:return 22;default:return e}};class Z{constructor(e,t=!1){this.position=e,this.required=t}}C=class{nextCodePoint(){let e=this.string.charCodeAt(this.pos++),t=this.string.charCodeAt(this.pos);return 55296<=e&&e<=56319&&56320<=t&&t<=57343?(this.pos++,(e-55296)*1024+(t-56320)+65536):e}nextCharClass(){return F(j.get(this.nextCodePoint()))}getSimpleBreak(){switch(this.nextClass){case 41:return!1;case 34:case 37:case 38:return this.curClass=34,!1;case 36:return this.curClass=36,!1}return null}getPairTableBreak(e){let t=!1;switch(E[this.curClass][this.nextClass]){case 0:t=!0;break;case 1:t=41===e;break;case 2:if(!(t=41===e))return!1;break;case 3:if(41!==e)return t}return this.LB8a&&(t=!1),this.LB21a&&(16===this.curClass||17===this.curClass)?(t=!1,this.LB21a=!1):this.LB21a=13===this.curClass,28===this.curClass?(this.LB30a++,2==this.LB30a&&28===this.nextClass&&(t=!0,this.LB30a=0)):this.LB30a=0,this.curClass=this.nextClass,t}nextBreak(){if(null==this.curClass){let e=this.nextCharClass();this.curClass=D(e),this.nextClass=e,this.LB8a=31===e,this.LB30a=0}for(;this.pos<this.string.length;){this.lastPos=this.pos;let e=this.nextClass;if(this.nextClass=this.nextCharClass(),34===this.curClass||36===this.curClass&&37!==this.nextClass)return this.curClass=D(F(this.nextClass)),new Z(this.lastPos,!0);let t=this.getSimpleBreak();if(null===t&&(t=this.getPairTableBreak(e)),this.LB8a=31===this.nextClass,t)return new Z(this.lastPos)}return this.lastPos<this.string.length?(this.lastPos=this.string.length,new Z(this.string.length)):null}constructor(e){this.string=e,this.pos=0,this.lastPos=0,this.curClass=null,this.nextClass=null,this.LB8a=!1,this.LB21a=!1,this.LB30a=0}};const q=/[\p{scx=Latin}0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]+/u,R=/[\p{scx=Hiragana}\p{scx=Katakana}|ｦ-ﾟ\p{scx=Han}]+/u,M=/（|［|｛|〔|〈|《|「|『|【|〘|〖|“|‘/,K=/）|］|｝|〕|〉|》|」|』|】|〙|〗|”|’/,J=/・|：|；/,Q=/、|，/,G=/。|．/,Y=RegExp(`[—‥…＿${String.fromCharCode(9472)}-${String.fromCharCode(9599)}]+`),$={shouldNotBreak:e=>Y.test(e),shouldAddThinSpace:(e,t)=>{for(let{regex:n,hasSpaceBefore:r,hasSpaceAfter:s}of Object.values({spaceBefore:{regex:M,hasSpaceBefore:!0,hasSpaceAfter:!1},spaceAfter:{regex:RegExp(`(${K.source}|${Q.source}|${G.source})`),hasSpaceBefore:!1,hasSpaceAfter:!0},spaceBoth:{regex:J,hasSpaceBefore:!0,hasSpaceAfter:!0}}))if(r&&n.test(t)&&!n.test(e)||s&&n.test(e)&&!n.test(t))return!0;return!1},startsWithPunctuation:e=>RegExp(`^[${G.source}${Q.source}]`).test(e)},_={isLatin:e=>q.test(e),isJapanese:e=>R.test(e),hasLanguageTransition:(e,t)=>_.isJapanese(e)!==_.isJapanese(t),shouldAddThinSpace:(e,t)=>_.hasLanguageTransition(e,t)&&!$.startsWithPunctuation(t)},ee=()=>"<wbr>",et=(e,t)=>ei(t?" ":"&nbsp;","typeset-thin-space",`letter-spacing: ${e};`,!0),en=(e,t)=>{if(0===e)return"";let n="typeset-kerning";return e<0?ei("",n,`margin: ${e/1e3/2+"em"};`,!0):ei(t?" ":"&nbsp;",n,`letter-spacing: ${e/1e3+"em"};`,!0)},er=(e,t)=>{let n="typeset-wrapper";return ei(e,t?`${n} typeset-word-break`:n)},es=e=>ei(e,"typeset-latin"),ea=e=>ei(e,"typeset-no-breaks"),ei=(e,t,n="",r=!1)=>{let s=n?` style="${n}"`:"";return`<span class="${t}"${s}${r?' aria-hidden="true" data-nosnippet=""':""}>${e}</span>`},eo=e=>Array.from(new Intl.Segmenter("ja-JP",{granularity:"word"}).segment(e),({segment:e})=>e),ec=(e,t="",n)=>{if(!t)return e;let r=n.insertThinSpaces&&eu(e,t),s=el(e,t);return r?e+et(n.thinSpaceWidth,s):n.useWordBreak&&s?e+ee():e},eu=(e,t)=>_.shouldAddThinSpace(e,t)||$.shouldAddThinSpace(e,t),el=(e,t)=>{let n=e.slice(-1)+t.slice(0,1),r=new C(n).nextBreak();return!!r&&1===r.position};var eh=(e,t,n)=>{let r=eo(e),s=eo(t);return r.reduce((e,t,r,a)=>e+ec(t,a[r+1]||s[0],n),"")};const ed=(e,t,n)=>" "===e?e:er(e,n.useWordBreak),ef=(e,t,n)=>" "===e?e:n.wrapLatin&&_.isLatin(e)?e.replace(q,e=>es(e)):n.noSpaceBetweenNoBreaks&&$.shouldNotBreak(e)?e.replace(Y,e=>ea(e)):e,ep=(e,t,n)=>{let r=[...e];return r.map((e,s)=>{let a=r[s+1]||t[0]||"",i=n.kerningRules.find(t=>t.between[0]===e&&t.between[1]===a);if(i){let t="number"==typeof i.value?i.value:parseInt(i.value,10),r=!n.useWordBreak&&el(e,a);return e+en(t,r)}return e}).join("")};class eg extends d{static getDefaultOptions(){return{useWordBreak:!0,wrapLatin:!0,noSpaceBetweenNoBreaks:!0,insertThinSpaces:!0,thinSpaceWidth:"0.2em",kerningRules:[]}}constructor(e={}){super([ed,eh,ef,ep],eg.validateOptions(e)),this.isIntlSegmenterSupported=void 0!==Intl.Segmenter,this.isIntlSegmenterSupported||console.warn(`
        Intl.Segmenter is not supported in this environment. 
        The original HTML string will be returned. 
        For more information, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
        `)}static validateOptions(e){return e.kerningRules&&(e.kerningRules=e.kerningRules.filter(eg.isValidKerningRule)),{...eg.getDefaultOptions(),...e}}static isValidKerningRule(e){return 1===e.between[0].length&&1===e.between[1].length||(console.warn(`Kerning rule between '${e.between[0]}' and '${e.between[1]}' must be single characters.`),!1)}render(e){return this.isIntlSegmenterSupported&&e?this.processHtmlWithFunctions(e):e}renderToElements(e){this.isIntlSegmenterSupported&&e&&(Array.isArray(e)||(e=[e]),e.forEach(e=>{let t=this.render(e.innerHTML);e.innerHTML=t}))}renderToSelector(e){if(!this.isIntlSegmenterSupported||!e)return;let n=t.document.querySelectorAll(e);this.renderToElements(Array.from(n))}}const eb=document.getElementById("toggleButton"),ev=document.getElementById("target"),em=ev.innerHTML;let ey="",ew=!0;const eA=document.getElementById("useWordBreakToggle"),eL=document.getElementById("insertThinSpacesToggle"),ek=document.getElementById("wrapLatinToggle"),eB=document.getElementById("noSpaceBetweenNoBreaksToggle"),eS=document.getElementById("kerningRulesToggle");let ex={kerningRules:ez(!0)};function eH(){let e=document.getElementById("email");if(e){let t=e.innerHTML.replace("[-]","@");e.innerHTML=t;let n=e.textContent||"";e.href="mailto:"+n}}function eP(){ex={...ex,useWordBreak:eA.checked,insertThinSpaces:eL.checked,wrapLatin:ek.checked,noSpaceBetweenNoBreaks:eB.checked,kerningRules:ez(eS.checked)},eX(),eT(),eH()}function eT(){document.querySelectorAll('#target input[type="checkbox"]').forEach(e=>{if(e.addEventListener("change",eW),e.dataset.id){let t=document.getElementById(e.dataset.id);t&&t.checked!==e.checked&&(e.checked=t.checked)}})}function eX(){ey=new eg(ex).render(em),ew&&(ev.innerHTML=ey)}function eW(e){let t=e.target,n=t.dataset.id;if(n){let e=document.getElementById(n);e&&(e.checked=t.checked,eP())}}function ez(e){return e?[{between:["美","し"],value:60},{between:["ス","ト"],value:120},{between:["イ","ブ"],value:20},{between:["ブ","ラ"],value:-30},{between:["ラ","リ"],value:30},{between:["て","、"],value:-60},{between:["す","。"],value:-120},{between:["よ","う"],value:60},{between:["う","な"],value:40},{between:["さ","れ"],value:20},{between:["れ","た"],value:-60},{between:["供","し"],value:40},{between:["し","ま"],value:70}]:[]}document.addEventListener("DOMContentLoaded",function(){eb.addEventListener("click",()=>{var e;ev.innerHTML=ew?em:ey,ew=!ew,eH(),ew&&eT(),e=eb.checked,document.querySelectorAll('#options input[type="checkbox"], #target input[type="checkbox"]').forEach(t=>{t.disabled=!e})}),eX(),eH(),document.querySelectorAll('#options input[type="checkbox"]').forEach(e=>{e.addEventListener("change",eP)}),ev.addEventListener("change",e=>{e.target.matches('input[type="checkbox"]')&&eW(e)})});
//# sourceMappingURL=index.3a028d61.js.map