function e(e){return e&&e.__esModule?e.default:e}var t,r,n,s,a,o,i,l,u="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},c={},d={},p=u.parcelRequireabbe;null==p&&((p=function(e){if(e in c)return c[e].exports;if(e in d){var t=d[e];delete d[e];var r={id:e,exports:{}};return c[e]=r,t.call(r.exports,r,r.exports),r.exports}var n=Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}).register=function(e,t){d[e]=t},u.parcelRequireabbe=p);var f=p.register;f("fL102",function(e,t){var r=e.exports&&e.exports.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e.exports,"__esModule",{value:!0}),e.exports.getTextNodes=e.exports.parseFromString=void 0;let n=r(p("9uQ1w")),s=e=>new n.default.DOMParser().parseFromString(e,"text/html");e.exports.parseFromString=s;let a=e=>{let t=n.default.document.createTreeWalker(e,n.default.NodeFilter.SHOW_TEXT),r=t.nextNode(),s=[];for(;r;)r.nodeValue&&""!==r.nodeValue.trim()&&s.push(r),r=t.nextNode();return s};e.exports.getTextNodes=a,e.exports.default=class{constructor(e,t){this.replaceNode=(e,t)=>{let r=n.default.document.createRange();r.selectNode(e);let s=r.createContextualFragment(t);e.parentNode&&(e.parentNode.insertBefore(s,e),e.parentNode.removeChild(e))},this.transformFunctions=e,this.options=t}processHtmlWithFunctions(e){return""===e?e:this.transformFunctions.reduce((e,t)=>this.processHtml(e,t),e)}processHtml(e,t){if(""===e)return e;let r=s(e),n=a(r.body);return n.forEach((e,r)=>{let s=n[r+1]||null,a=this.getTransformedHtml(e,s,t);this.replaceNode(e,a)}),r.body.innerHTML}getTransformedHtml(e,t,r){return r(e.nodeValue||"",t&&t.nodeValue||"",this.options)}}}),f("9uQ1w",function(e,t){Object.defineProperty(e.exports,"__esModule",{value:!0});let r=window;e.exports.default=r}),f("2JUIA",function(e,t){var r=e.exports&&e.exports.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e.exports,"__esModule",{value:!0}),e.exports.shouldAddThinSpace=e.exports.shouldAddWbr=e.exports.addSeparatorsToSegment=e.exports.createSegments=void 0;let n=r(p("hvTPx"));var s=p("5xmI1"),a=p("bEZ8N");let o=e=>Array.from(new Intl.Segmenter("ja-JP",{granularity:"word"}).segment(e),({segment:e})=>e);e.exports.createSegments=o;let i=(e,t="",r)=>{if(!t)return e;let n=r.useWordBreak&&l(e,t),s=r.insertThinSpaces&&u(e,t);return e+(s?(0,a.createThinSpace)(r.thinSpaceWidth,r.classNamePrefix):"")+(n?a.wbr:"")};e.exports.addSeparatorsToSegment=i;let l=(e,t)=>{let r=e.slice(-1)+t.slice(0,1),s=new n.default(r).nextBreak();return s&&1===s.position};e.exports.shouldAddWbr=l;let u=(e,t)=>s.LanguageClass.shouldAddThinSpace(e,t)||s.CharClass.shouldAddThinSpace(e,t);e.exports.shouldAddThinSpace=u,e.exports.default=(e,t,r)=>{let n=o(e),s=o(t);return n.reduce((e,t,n,a)=>e+i(t,a[n+1]||s[0],r),"")}}),f("hvTPx",function(t,r){Object.defineProperty(t.exports,"__esModule",{value:!0,configurable:!0}),Object.defineProperty(t.exports,"default",{get:function(){return a},set:void 0,enumerable:!0,configurable:!0});var n=p("hYX6R"),s=p("gpXal"),a={};let o=[[4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,3,4,4,4,4,4,4,4,4,4,4,4],[0,4,4,1,1,4,4,4,4,1,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,4,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[4,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,1],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,1],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,1,0,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,0,0,1,1,1,1,1,1,1,0,0,4,2,4,1,1,1,1,1,0,1,1,1,0],[1,4,4,1,1,1,4,4,4,0,0,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,0,1,4,4,4,0,0,1,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,0,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,4,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,4,2,4,1,1,1,1,1,1,1,1,1,1],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,1,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,1,1,1,1,0,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,1,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,1,0,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,0,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,1,0,0,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,1,1,0],[0,4,4,1,1,1,4,4,4,0,1,0,0,0,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[1,4,4,1,1,1,4,4,4,1,1,1,1,1,0,1,1,1,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0],[0,4,4,1,1,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,4,2,4,0,0,0,0,0,0,0,0,1,0]],i=e(s).toByteArray("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"),l=new(e(n))(i),u=function(e){switch(e){case 33:case 39:case 40:case 42:return 12;case 35:return 5;default:return e}},c=function(e){switch(e){case 37:case 38:return 34;case 41:return 22;default:return e}};class d{constructor(e,t=!1){this.position=e,this.required=t}}a=class{nextCodePoint(){let e=this.string.charCodeAt(this.pos++),t=this.string.charCodeAt(this.pos);return 55296<=e&&e<=56319&&56320<=t&&t<=57343?(this.pos++,(e-55296)*1024+(t-56320)+65536):e}nextCharClass(){return u(l.get(this.nextCodePoint()))}getSimpleBreak(){switch(this.nextClass){case 41:return!1;case 34:case 37:case 38:return this.curClass=34,!1;case 36:return this.curClass=36,!1}return null}getPairTableBreak(e){let t=!1;switch(o[this.curClass][this.nextClass]){case 0:t=!0;break;case 1:t=41===e;break;case 2:if(!(t=41===e))return!1;break;case 3:if(41!==e)return t}return this.LB8a&&(t=!1),this.LB21a&&(16===this.curClass||17===this.curClass)?(t=!1,this.LB21a=!1):this.LB21a=13===this.curClass,28===this.curClass?(this.LB30a++,2==this.LB30a&&28===this.nextClass&&(t=!0,this.LB30a=0)):this.LB30a=0,this.curClass=this.nextClass,t}nextBreak(){if(null==this.curClass){let e=this.nextCharClass();this.curClass=c(e),this.nextClass=e,this.LB8a=31===e,this.LB30a=0}for(;this.pos<this.string.length;){this.lastPos=this.pos;let e=this.nextClass;if(this.nextClass=this.nextCharClass(),34===this.curClass||36===this.curClass&&37!==this.nextClass)return this.curClass=c(u(this.nextClass)),new d(this.lastPos,!0);let t=this.getSimpleBreak();if(null===t&&(t=this.getPairTableBreak(e)),this.LB8a=31===this.nextClass,t)return new d(this.lastPos)}return this.lastPos<this.string.length?(this.lastPos=this.string.length,new d(this.string.length)):null}constructor(e){this.string=e,this.pos=0,this.lastPos=0,this.curClass=null,this.nextClass=null,this.LB8a=!1,this.LB21a=!1,this.LB30a=0}}}),f("hYX6R",function(e,t){var r=p("ado7A"),n=p("3pWLl").swap32LE;e.exports=class{constructor(e){let t="function"==typeof e.readUInt32BE&&"function"==typeof e.slice;if(t||e instanceof Uint8Array){let s;if(t)this.highStart=e.readUInt32LE(0),this.errorValue=e.readUInt32LE(4),s=e.readUInt32LE(8),e=e.slice(12);else{let t=new DataView(e.buffer);this.highStart=t.getUint32(0,!0),this.errorValue=t.getUint32(4,!0),s=t.getUint32(8,!0),e=e.subarray(12)}e=r(e,new Uint8Array(s)),n(e=r(e,new Uint8Array(s))),this.data=new Uint32Array(e.buffer)}else({data:this.data,highStart:this.highStart,errorValue:this.errorValue}=e)}get(e){let t;return e<0||e>1114111?this.errorValue:e<55296||e>56319&&e<=65535?(t=(this.data[e>>5]<<2)+(31&e),this.data[t]):e<=65535?(t=(this.data[2048+(e-55296>>5)]<<2)+(31&e),this.data[t]):e<this.highStart?(t=this.data[2080+(e>>11)],t=((t=this.data[t+(e>>5&63)])<<2)+(31&e),this.data[t]):this.data[this.data.length-4]}}}),f("ado7A",function(e,t){function r(){this.table=new Uint16Array(16),this.trans=new Uint16Array(288)}function n(e,t){this.source=e,this.sourceIndex=0,this.tag=0,this.bitcount=0,this.dest=t,this.destLen=0,this.ltree=new r,this.dtree=new r}var s=new r,a=new r,o=new Uint8Array(30),i=new Uint16Array(30),l=new Uint8Array(30),u=new Uint16Array(30),c=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),d=new r,p=new Uint8Array(320);function f(e,t,r,n){var s,a;for(s=0;s<r;++s)e[s]=0;for(s=0;s<30-r;++s)e[s+r]=s/r|0;for(a=n,s=0;s<30;++s)t[s]=a,a+=1<<e[s]}var h=new Uint16Array(16);function g(e,t,r,n){var s,a;for(s=0;s<16;++s)e.table[s]=0;for(s=0;s<n;++s)e.table[t[r+s]]++;for(a=0,e.table[0]=0,s=0;s<16;++s)h[s]=a,a+=e.table[s];for(s=0;s<n;++s)t[r+s]&&(e.trans[h[t[r+s]]++]=s)}function b(e,t,r){if(!t)return r;for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;var n=e.tag&65535>>>16-t;return e.tag>>>=t,e.bitcount-=t,n+r}function x(e,t){for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;var r=0,n=0,s=0,a=e.tag;do n=2*n+(1&a),a>>>=1,++s,r+=t.table[s],n-=t.table[s];while(n>=0)return e.tag=a,e.bitcount-=s,t.trans[r+n]}function y(e,t,r){for(;;){var n,s,a,c,d=x(e,t);if(256===d)return 0;if(d<256)e.dest[e.destLen++]=d;else for(d-=257,n=b(e,o[d],i[d]),s=x(e,r),c=a=e.destLen-b(e,l[s],u[s]);c<a+n;++c)e.dest[e.destLen++]=e.dest[c]}}(function(e,t){var r;for(r=0;r<7;++r)e.table[r]=0;for(r=0,e.table[7]=24,e.table[8]=152,e.table[9]=112;r<24;++r)e.trans[r]=256+r;for(r=0;r<144;++r)e.trans[24+r]=r;for(r=0;r<8;++r)e.trans[168+r]=280+r;for(r=0;r<112;++r)e.trans[176+r]=144+r;for(r=0;r<5;++r)t.table[r]=0;for(r=0,t.table[5]=32;r<32;++r)t.trans[r]=r})(s,a),f(o,i,4,3),f(l,u,2,1),o[28]=0,i[28]=258,e.exports=function(e,t){var r,o,i=new n(e,t);do{switch(r=function(e){e.bitcount--||(e.tag=e.source[e.sourceIndex++],e.bitcount=7);var t=1&e.tag;return e.tag>>>=1,t}(i),b(i,2,0)){case 0:o=function(e){for(var t,r;e.bitcount>8;)e.sourceIndex--,e.bitcount-=8;if((t=256*(t=e.source[e.sourceIndex+1])+e.source[e.sourceIndex])!==(65535&~(256*e.source[e.sourceIndex+3]+e.source[e.sourceIndex+2])))return -3;for(e.sourceIndex+=4,r=t;r;--r)e.dest[e.destLen++]=e.source[e.sourceIndex++];return e.bitcount=0,0}(i);break;case 1:o=y(i,s,a);break;case 2:(function(e,t,r){for(o=0,n=b(e,5,257),s=b(e,5,1),a=b(e,4,4);o<19;++o)p[o]=0;for(o=0;o<a;++o){var n,s,a,o,i,l,u=b(e,3,0);p[c[o]]=u}for(g(d,p,0,19),i=0;i<n+s;){var f=x(e,d);switch(f){case 16:var h=p[i-1];for(l=b(e,2,3);l;--l)p[i++]=h;break;case 17:for(l=b(e,3,3);l;--l)p[i++]=0;break;case 18:for(l=b(e,7,11);l;--l)p[i++]=0;break;default:p[i++]=f}}g(t,p,0,n),g(r,p,n,s)})(i,i.ltree,i.dtree),o=y(i,i.ltree,i.dtree);break;default:o=-3}if(0!==o)throw Error("Data error")}while(!r)return i.destLen<i.dest.length?"function"==typeof i.dest.slice?i.dest.slice(0,i.destLen):i.dest.subarray(0,i.destLen):i.dest}}),f("3pWLl",function(e,t){let r=18===new Uint8Array(new Uint32Array([305419896]).buffer)[0],n=(e,t,r)=>{let n=e[t];e[t]=e[r],e[r]=n},s=e=>{let t=e.length;for(let r=0;r<t;r+=4)n(e,r,r+3),n(e,r+1,r+2)};e.exports={swap32LE:e=>{r&&s(e)}}}),f("gpXal",function(e,t){!function(e){var t="undefined"!=typeof Uint8Array?Uint8Array:Array;function r(e){var t=e.charCodeAt(0);return 43===t||45===t?62:47===t||95===t?63:t<48?-1:t<58?t-48+26+26:t<91?t-65:t<123?t-97+26:void 0}e.toByteArray=function(e){if(e.length%4>0)throw Error("Invalid string. Length must be a multiple of 4");var n,s,a,o,i,l,u=e.length;i="="===e.charAt(u-2)?2:"="===e.charAt(u-1)?1:0,l=new t(3*e.length/4-i),a=i>0?e.length-4:e.length;var c=0;function d(e){l[c++]=e}for(n=0,s=0;n<a;n+=4,s+=3)d((16711680&(o=r(e.charAt(n))<<18|r(e.charAt(n+1))<<12|r(e.charAt(n+2))<<6|r(e.charAt(n+3))))>>16),d((65280&o)>>8),d(255&o);return 2===i?d(255&(o=r(e.charAt(n))<<2|r(e.charAt(n+1))>>4)):1===i&&(d((o=r(e.charAt(n))<<10|r(e.charAt(n+1))<<4|r(e.charAt(n+2))>>2)>>8&255),d(255&o)),l},e.fromByteArray=function(e){var t,r,n,s,a=e.length%3,o="";function i(e){return"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e)}for(r=0,s=e.length-a;r<s;r+=3)o+=i((t=n=(e[r]<<16)+(e[r+1]<<8)+e[r+2])>>18&63)+i(t>>12&63)+i(t>>6&63)+i(63&t);switch(a){case 1:o+=i((n=e[e.length-1])>>2)+i(n<<4&63)+"==";break;case 2:o+=i((n=(e[e.length-2]<<8)+e[e.length-1])>>10)+i(n>>4&63)+i(n<<2&63)+"="}return o}}(e.exports)}),f("5xmI1",function(e,t){var r=e.exports&&e.exports.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var s=Object.getOwnPropertyDescriptor(t,r);(!s||("get"in s?!t.__esModule:s.writable||s.configurable))&&(s={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,s)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),n=e.exports&&e.exports.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),s=e.exports&&e.exports.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)"default"!==s&&Object.prototype.hasOwnProperty.call(e,s)&&r(t,e,s);return n(t,e),t};Object.defineProperty(e.exports,"__esModule",{value:!0}),e.exports.LanguageClass=e.exports.CharClass=void 0;let a=s(p("7K6Y4"));e.exports.CharClass={shouldNotBreak:e=>a.noBreakRulesRegex.test(e),shouldAddThinSpace:(e,t)=>{for(let{regex:r,hasSpaceBefore:n,hasSpaceAfter:s}of Object.values({openings:{regex:a.openingsRegex,hasSpaceBefore:!0,hasSpaceAfter:!1},closings:{regex:a.closingsRegex,hasSpaceBefore:!1,hasSpaceAfter:!0},middleDots:{regex:a.middleDotsRegex,hasSpaceBefore:!0,hasSpaceAfter:!0}}))if(n&&r.test(t)&&!r.test(e)||s&&r.test(e)&&!r.test(t))return!0;return!1}};let o={isLatin:e=>a.latinRegex.test(e),isJapanese:e=>a.japaneseRegex.test(e),isDifferentLanguageClass:(e,t)=>o.isJapanese(e)&&o.isLatin(t)||o.isLatin(e)&&o.isJapanese(t),shouldAddThinSpace:(e,t)=>o.isDifferentLanguageClass(e,t)};e.exports.LanguageClass=o}),f("7K6Y4",function(e,t){Object.defineProperty(e.exports,"__esModule",{value:!0}),e.exports.noBreakRulesRegex=e.exports.middleDotsRegex=e.exports.closingsRegex=e.exports.openingsRegex=e.exports.japaneseRegex=e.exports.latinRegex=void 0,e.exports.latinRegex=/[\p{scx=Latin}0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/u,e.exports.japaneseRegex=/[\p{scx=Hiragana}\p{scx=Katakana}|ｦ-ﾟ\p{scx=Han}]+/u,e.exports.openingsRegex=/（|［|｛|〔|〈|《|「|『|【|〘|〖|“|‘/,e.exports.closingsRegex=/）|］|｝|〕|〉|》|」|』|】|〙|〗|”|’|、|，|。|．/,e.exports.middleDotsRegex=/・|：|；/,e.exports.noBreakRulesRegex=RegExp(`[—‥…＿${String.fromCharCode(9472)}-${String.fromCharCode(9599)}]+`)}),f("bEZ8N",function(e,t){Object.defineProperty(e.exports,"__esModule",{value:!0}),e.exports.applyNoBreakStyle=e.exports.applyLatinStyle=e.exports.applyWrapperStyle=e.exports.createKerning=e.exports.createThinSpace=e.exports.wbr=void 0;let r={styles:{preventSelect:"user-select:none;"},attributes:{hiddenFromReader:'aria-hidden="true"',noIndex:'data-nosnippet=""'}};e.exports.wbr="<wbr>",e.exports.createThinSpace=(e,t)=>{let n=String.fromCharCode(8201),s=`font-size: ${e}; letter-spacing: 0; line-height: 0; ${r.styles.preventSelect}`;return`<span class="${t+"-thin-space"}" style="${s}" ${r.attributes.hiddenFromReader} ${r.attributes.noIndex}>${n}</span>`},e.exports.createKerning=(e,t)=>{let n=`margin: ${e/1e3/2+"em"}; ${r.styles.preventSelect}`;return`<span class="${t+"-kerning"}" style="${n}" ${r.attributes.hiddenFromReader} ${r.attributes.noIndex}></span>`},e.exports.applyWrapperStyle=(e,t,r)=>`<span class="${t}" style="${r?"word-break: keep-all; overflow-wrap: anywhere;":""}">${e}</span>`,e.exports.applyLatinStyle=(e,t)=>`<span class="${t+"-latin"}">${e}</span>`,e.exports.applyNoBreakStyle=(e,t)=>`<span class="${t+"-no-breaks"}" style="letter-spacing: 0">${e}</span>`}),t=document,n={kitId:"jgt3rhh",scriptTimeout:3e3,async:!0},s=t.documentElement,a=setTimeout(function(){s.className=s.className.replace(/\bwf-loading\b/g,"")+" wf-inactive"},n.scriptTimeout),o=t.createElement("script"),i=!1,l=t.getElementsByTagName("script")[0],s.className+=" wf-loading",o.src="https://use.typekit.net/"+n.kitId+".js",o.async=!0,o.onload=o.onreadystatechange=function(){if(r=this.readyState,!i&&(!r||"complete"==r||"loaded"==r)){i=!0,clearTimeout(a);try{Typekit.load(n)}catch(e){}}},l.parentNode.insertBefore(o,l);var h={},g=h&&h.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(h,"__esModule",{value:!0});const b=g(p("fL102")),x=g(p("2JUIA"));var y={};Object.defineProperty(y,"__esModule",{value:!0}),y.applyStyleToSegment=y.applyStyleToText=void 0;var v=p("5xmI1"),m=p("bEZ8N");y.applyStyleToText=(e,t,r)=>" "===e?e:(0,m.applyWrapperStyle)(e,r.classNamePrefix,r.useWordBreak),y.applyStyleToSegment=(e,t,r)=>{if(" "===e)return e;let n=w(e,t,r);return r.wrapLatin&&v.LanguageClass.isLatin(e)?(0,m.applyLatinStyle)(n,r.classNamePrefix):r.noSpaceBetweenNoBreaks&&v.CharClass.shouldNotBreak(e)?(0,m.applyNoBreakStyle)(n,r.classNamePrefix):n};const w=(e,t,r)=>{let n=[...e];return n.map((e,s)=>{let a=n[s+1]||t[0]||"",o=r.kerningRules.find(t=>t.between[0]===e&&t.between[1]===a);if(o){let t="number"==typeof o.value?o.value:parseInt(o.value,10);return e+(0,m.createKerning)(t,r.classNamePrefix)}return e}).join("")},S=g(p("9uQ1w"));class L extends b.default{static getDefaultOptions(){return{classNamePrefix:"typeset",useWordBreak:!0,wrapLatin:!0,noSpaceBetweenNoBreaks:!0,insertThinSpaces:!0,thinSpaceWidth:"100%",kerningRules:[]}}constructor(e={}){super([y.applyStyleToText,x.default,y.applyStyleToSegment],L.validateOptions(e)),this.isIntlSegmenterSupported=void 0!==Intl.Segmenter,this.isIntlSegmenterSupported||console.warn(`
        Intl.Segmenter is not supported in this environment. 
        The original HTML string will be returned. 
        For more information, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
        `)}static validateOptions(e){return e.kerningRules&&(e.kerningRules=e.kerningRules.filter(L.isValidKerningRule)),Object.assign(Object.assign({},L.getDefaultOptions()),e)}static isValidKerningRule(e){return 1===e.between[0].length&&1===e.between[1].length||(console.warn(`Kerning rule between '${e.between[0]}' and '${e.between[1]}' must be single characters.`),!1)}render(e){return this.isIntlSegmenterSupported&&e?this.processHtmlWithFunctions(e):e}renderToElements(e){this.isIntlSegmenterSupported&&e&&(Array.isArray(e)||(e=[e]),e.forEach(e=>{let t=this.render(e.innerHTML);e.innerHTML=t}))}renderToSelector(e){if(!this.isIntlSegmenterSupported||!e)return;let t=S.default.document.querySelectorAll(e);this.renderToElements(Array.from(t))}}h.default=L;const A=document.getElementById("toggleButton"),P=document.getElementById("target"),T=P.innerHTML;let k="",B=!0;const N=document.getElementById("useWordBreakToggle"),H=document.getElementById("insertThinSpacesToggle"),X=document.getElementById("wrapLatinToggle"),W=document.getElementById("noSpaceBetweenNoBreaksToggle"),O=document.getElementById("kerningRulesToggle");let C={kerningRules:E(!0)};function I(){let e=document.getElementById("email");if(e){let t=e.innerHTML.replace("[-]","@");e.innerHTML=t;let r=e.textContent||"";e.href="mailto:"+r}}function z(){C={...C,useWordBreak:N.checked,insertThinSpaces:H.checked,wrapLatin:X.checked,noSpaceBetweenNoBreaks:W.checked,kerningRules:E(O.checked)},U(),j(),I()}function j(){document.querySelectorAll('#target input[type="checkbox"]').forEach(e=>{if(e.addEventListener("change",V),e.dataset.id){let t=document.getElementById(e.dataset.id);t&&t.checked!==e.checked&&(e.checked=t.checked)}})}function U(){k=new(e(h))(C).render(T),B&&(P.innerHTML=k)}function V(e){let t=e.target,r=t.dataset.id;if(r){let e=document.getElementById(r);e&&(e.checked=t.checked,z())}}function E(e){return e?[{between:["美","し"],value:60},{between:["ス","ト"],value:120},{between:["イ","ブ"],value:20},{between:["ブ","ラ"],value:-30},{between:["ラ","リ"],value:30},{between:["て","、"],value:-60},{between:["す","。"],value:-120},{between:["よ","う"],value:60},{between:["う","な"],value:40},{between:["さ","れ"],value:20},{between:["れ","た"],value:-60},{between:["供","し"],value:40},{between:["し","ま"],value:70}]:[]}document.addEventListener("DOMContentLoaded",function(){A.addEventListener("click",()=>{var e;P.innerHTML=B?T:k,B=!B,I(),B&&j(),e=A.checked,document.querySelectorAll('#options input[type="checkbox"], #target input[type="checkbox"]').forEach(t=>{t.disabled=!e})}),U(),I(),document.querySelectorAll('#options input[type="checkbox"]').forEach(e=>{e.addEventListener("change",z)}),P.addEventListener("change",e=>{e.target.matches('input[type="checkbox"]')&&V(e)})});
//# sourceMappingURL=index.750b1303.js.map
