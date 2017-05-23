!function(t){function i(s){if(e[s])return e[s].exports;var n=e[s]={i:s,l:!1,exports:{}};return t[s].call(n.exports,n,n.exports,i),n.l=!0,n.exports}var e={};i.m=t,i.c=e,i.i=function(t){return t},i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:s})},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},i.p="",i(i.s=23)}([function(t,i){function e(t,i,e,s,n,o,h,r){this.font=t,this.x=i,this.y=e,this.winMargin=o,this.width=s,this.lineHeight=t.data.lineHeight,this.rowHeight=n,this.itemOffset=Math.max(Math.floor((this.rowHeight-this.lineHeight)/2),0),this.setOptions(h),this.choiceHandler=r,this.selected=null,this.visible=!0}e.prototype.setOptions=function(t){this.options=t||[]},e.prototype.draw=function(t){if(this.visible){var i=this.options,e=i.length,s=this.rowHeight,n=this.winMargin,o=this.itemOffset;t.fillStyle="black",t.fillRect(this.x-n,this.y-n,this.width+2*n,e*s+2*n);for(var h=this.x,r=this.y,a=this.font,c=0;c<e;c++)a.drawText(t,i[c].text,h+o,r+o),r+=s;null!==this.selected&&(t.fillStyle="rgba(170, 170, 170, 0.5)",t.fillRect(this.x,this.y+this.selected*s,this.width,s))}},e.prototype.event=function(t,i,e){if(this.visible){var s=i-this.x,n=e-this.y,o=this.rowHeight,h=this.options.length*o;if(s>0&&n>0&&s<this.width&&n<h){var r=Math.floor(n/o);switch(t){case"click":this.choiceHandler(this.options[r]),this.selected=null;break;case"down":this.selected=r}return!0}return!1}},e.prototype.show=function(){this.visible=!0},e.prototype.hide=function(){this.visible=!1},t.exports=e},function(t,i){function e(t,i){this.frame=i.frame,this.x=i.x,this.y=i.y,this.z=0,this.velocityX=1,this.velocityY=1,this.velocityZ=0,this.width=16,this.height=8,this.world=t}e.prototype.update=function(){this.move(),this.prevX=this.x,this.prevY=this.y,this.x=this.x+this.velocityX,this.y=this.y+this.velocityY,this.x=Math.min(this.x,this.world.width),this.x=Math.max(this.x,0),this.y=Math.min(this.y,this.world.height),this.y=Math.max(this.y,0),this.z<=0?(this.z=0,this.velocityX||this.velocityY?this.velocityZ=2:this.velocityZ=0):this.velocityZ-=.25,this.z+=this.velocityZ},e.prototype.move=function(){},t.exports=e},function(t,i){var e={collision:function(t,i,e){var s=t.width/2,n=t.height/2,o=i.width/2,h=i.height/2,r=t.x+s,a=t.y+n,c=i.x+o,u=i.y+h,l=c-r,p=u-a,f=Math.abs(l)-s-o,d=Math.abs(p)-n-h;f<0&&d<0&&e(t,i,l,p,f,d)},pointInRect:function(t,i,e,s,n,o){return t>=e&&t<=e+n&&i>=s&&i<=s+o}};t.exports=e},function(t,i,e){function s(t,i){i=i||{};var e=new Image;return i.onload&&e.on("load",i.onload),e.src=t,e}var n=e(8),o=e(19),h=e(13),r=e(14),a=e(12),c=e(11),u=e(10),l=e(4),p={};p.setup=function(t,i,e){function p(){var t=document.documentElement.clientWidth,i=document.documentElement.clientHeight,e=g.width,s=g.height,n=Math.round(t/e),o=Math.round(i/s),h=Math.min(n,o);g.style.width=e*h+"px",g.style.height=s*h+"px"}function f(t,i,e){var s=Math.floor(i*(g.width/g.offsetWidth)),n=Math.floor(e*(g.height/g.offsetHeight));v.state.event(t,s,n)}function d(t,e){var s=e.changedTouches[0],n=g.getBoundingClientRect(),o=document.documentElement,h=n.top+i.pageYOffset-o.clientTop,r=n.left+i.pageXOffset-o.clientLeft;f(t,s.pageX-r,s.pageY-h)}function y(){w.clearRect(0,0,g.width,g.height),v.state.update(),v.state.draw(w,k),i.requestAnimationFrame(y)}var g=document.getElementById(t),w=g.getContext("2d"),v={};v.config=e,v.getWidth=function(){return g.width},v.getHeight=function(){return g.height},v.player={inventory:new n(8)},v.player.inventory.add("sneaker"),v.player.getGoodsMenu=function(){for(var t=[],i=this.inventory.getItems(),e=i.length,s=0;s<e;s++){var n=i[s],o=v.config.items[n];t.push({id:n,text:o.label})}return t};var x=function(t){return t.preventDefault(),i.scroll(0,0),!1};i.document.addEventListener("touchmove",x,!1);var m,b={click:"click",mouseup:"up",mousedown:"down"};for(m in b)Object.prototype.hasOwnProperty.call(b,m)&&function(t){g.addEventListener(t,function(i){f(b[t],i.offsetX,i.offsetY)},!1)}(m);var M={touchmove:"move",touchend:"up",touchstart:"down"};for(m in M)Object.prototype.hasOwnProperty.call(M,m)&&function(t){g.addEventListener(t,function(i){d(M[t],i)},!0)}(m);p(),i.addEventListener("resize",p);var k={world:s("./world.gif"),sprites:s("./sprites.gif"),basicfontsheet:s("./fonts/basic.png"),pattern:s("./pattern.png")};k.basicfont=new l(BasicFontMeta,k.basicfontsheet),v.ctx=w,v.resources=k,v.state=new o(v,{world:new h(v),worldmenu:new r(v),cutscene:new a(v),battlemenu:new c(v),battlebackground:new u(v)},"world"),y()},window.Game=p,t.exports=p},function(t,i){function e(t,i,e,s){e=e||0,s=s||0,this.sheet=i;var n={font:t.font.info._face,size:parseInt(t.font.info._size,10),lineHeight:parseInt(t.font.common._lineHeight,10)+s,chars:{}};t.font.chars.char.forEach(function(t){var i=parseInt(t._id,10);n.chars[i]={x:parseInt(t._x,10),y:parseInt(t._y,10),width:parseInt(t._width,10),height:parseInt(t._height,10),xOffset:parseInt(t._xoffset,10),yOffset:parseInt(t._yoffset,10),xAdvance:parseInt(t._xadvance,10)+e,kerning:{}}}),t.font.kernings&&t.font.kernings.kerning&&t.font.kernings.kerning.forEach(function(t){n.chars[t._second].kerning[t._first]=parseInt(t._amount,10)}),this.data=n}e.prototype.drawText=function(t,i,e,s){var n,o,h=this.data.chars,r=this.sheet;for(n=0;n<i.length;n++)o=h[i.charCodeAt(n)],t.drawImage(r,o.x,o.y,o.width,o.height,e+o.xOffset,s+o.yOffset,o.width,o.height),e+=o.xAdvance},e.prototype.measureText=function(t){var i,e,s=this.data.chars,n=0;for(i=0;i<t.length;i++)e=s[t.charCodeAt(i)],n+=e.xAdvance;return n},t.exports=e},function(t,i){var e={dialog:function(t,i,e){t.dialog.showText(i.text,e)},fadeOut:function(t,i,e){t.matte.fadeOut(i.ticks,e)},fadeIn:function(t,i,e){t.matte.fadeIn(i.ticks,e)},getItem:function(t,i,e){t.game.player.inventory.add(i.id);var s=t.game.config.items[i.id];t.dialog.showText("You got "+s.label+"!",e)}};t.exports=e},function(t,i){var e={hasItem:function(t,i){return t.game.player.inventory.contains(i.id)}};t.exports=e},function(t,i,e){function s(t,i){n.call(this,t,i)}var n=e(1);s.prototype=Object.create(n.prototype),s.prototype.move=function(){var t=this.world.player,i=t.x-this.x,e=t.y-this.y,s=i*i+e*e;this.velocityX=0,this.velocityY=0,s<1e4&&(t.x<this.x&&(this.velocityX=-1),t.y<this.y&&(this.velocityY=-1),t.x>this.x&&(this.velocityX=1),t.y>this.y&&(this.velocityY=1))},t.exports=s},function(t,i){function e(t){this.items=[],this.maxSize=t}e.prototype.add=function(t){this.items.length<this.maxSize&&this.items.push(t)},e.prototype.remove=function(t){this.items.splice(t,1)},e.prototype.getItems=function(){return this.items},e.prototype.contains=function(t){return-1!==this.items.indexOf(t)},e.prototype.isFull=function(){return this.items.length>=this.maxSize},t.exports=e},function(t,i,e){function s(t,i){n.call(this,t,i)}var n=e(1);s.prototype=Object.create(n.prototype),s.prototype.move=function(){this.velocityX=0,this.velocityY=0,this.going&&(this.goalX===this.x&&this.goalY===this.y||this.blockedCount>30?this.going=!1:(this.goalX<this.x&&(this.velocityX=-1),this.goalY<this.y&&(this.velocityY=-1),this.goalX>this.x&&(this.velocityX=1),this.goalY>this.y&&(this.velocityY=1))),this.going&&this.prevX===this.x&&this.prevY===this.y&&this.blockedCount++,this.goalRadius>0&&(this.goalRadius-=1)},t.exports=s},function(t,i,e){function s(t){this.game=t,this.background=new n(t)}var n=e(15);s.prototype.update=function(){this.background.update()},s.prototype.draw=function(t,i){this.background.draw(t)},t.exports=s},function(t,i,e){function s(t){this.game=t;var i=t.resources.basicfont;this.menus={base:new n(i,16,16,40,20,4,[{id:"bash",text:"Bash"},{id:"psi",text:"PSI"},{id:"goods",text:"Goods"}],this.onBaseMenu.bind(this)),goods:new n(i,72,16,80,20,4,[],this.onGoodsMenu.bind(this)),psi:new n(i,72,16,80,20,4,[{id:"love",text:"Love"},{id:"freeze",text:"Freeze"},{id:"fire",text:"Fire"}],this.onPSIMenu.bind(this))}}var n=e(0);s.prototype.setState=function(t){this.state=t;var i=this.menus;for(var e in i)Object.prototype.hasOwnProperty.call(this.menus,e)&&i[e].hide();switch(t){case"psi":i.psi.show(),i.base.show();break;case"goods":i.goods.setOptions(this.game.player.getGoodsMenu()),i.goods.show(),i.base.show();break;case"bash":case"base":i.base.show()}},s.prototype.enter=function(){this.setState("base")},s.prototype.update=function(){this.game.state.battlebackground.update()},s.prototype.onBaseMenu=function(t){this.setState(t.id)},s.prototype.onGoodsMenu=function(t){},s.prototype.onPSIMenu=function(t){},s.prototype.onCancel=function(){switch(this.state){case"goods":case"psi":case"bash":this.setState("base");break;case"base":this.game.state.switch("world")}},s.prototype.draw=function(t,i){this.game.state.battlebackground.draw(t,i);for(var e in this.menus)Object.prototype.hasOwnProperty.call(this.menus,e)&&this.menus[e].draw(t,i)},s.prototype.event=function(t,i,e){for(var s in this.menus)if(Object.prototype.hasOwnProperty.call(this.menus,s)&&this.menus[s].event(t,i,e))return;"click"===t&&this.onCancel()},t.exports=s},function(t,i,e){function s(t){this.game=t,this.dialog=new n(t.resources.basicfont,40,100,204,3),this.matte=new o(t),this.interpreter=new h(r,a),this.done=this.done.bind(this)}var n=e(16),o=e(17),h=e(18),r=e(5),a=e(6);s.prototype.enter=function(t){this.dialog.reset(),this.interpreter.run(t,this,this.done)},s.prototype.update=function(){this.dialog.update(),this.matte.update()},s.prototype.draw=function(t,i){this.game.state.world.draw(t,i),this.matte.draw(t),this.dialog.draw(t)},s.prototype.done=function(){this.game.state.switch("world")},s.prototype.event=function(t,i,e){this.dialog.event(t,i,e)},t.exports=s},function(t,i,e){function s(t){this.game=t,this.viewport=new n(t.ctx.canvas.width,t.ctx.canvas.height),this.world=new o(this.game);var i=t.resources.basicfont;this.menuButton=new h(i,250,135,29,20,4,[{id:"menu",text:"Menu"}],this.openMenu.bind(this)),this.menuButton.show()}var n=e(21),o=e(22),h=e(0),r=e(2);s.prototype.update=function(){var t=this.world,i=t.player;i.update(),t.update(),this.viewport.update(i,t)},s.prototype.draw=function(t,i){this.world.draw(t,this.viewport,i),this.game.state.currentState===this&&this.menuButton.draw(t)},s.prototype.onMouse=function(t,i){for(var e,s=this.viewport,n=t+s.x,o=i+s.y,h=null,a=this.world.player,c=this.world.events,u=0;u<c.length;u++)e=c[u],r.pointInRect(n,o,e.x,e.y-24,16,24)&&(h=e);h?(a.goalX=h.x+h.width/2-8,a.goalY=h.y+h.height/2-4,a.goalEvent=h):(a.goalX=n-8,a.goalY=o-4,a.goalEvent=null),a.goalRadius=20,a.going=!0,a.blockedCount=0},s.prototype.event=function(t,i,e){if(!this.menuButton.event(t,i,e))switch(t){case"click":case"move":this.onMouse(i,e)}},s.prototype.openMenu=function(){this.game.state.switch("worldmenu")},t.exports=s},function(t,i,e){function s(t){this.game=t;var i=t.resources.basicfont;this.menus={base:new n(i,16,16,40,20,4,[{id:"goods",text:"Goods"},{id:"equip",text:"Equip"},{id:"status",text:"Status"}],this.onBaseMenu.bind(this)),goods:new n(i,72,16,80,20,4,[],this.onGoodsMenu.bind(this))}}var n=e(0);s.prototype.setState=function(t){this.state=t;var i=this.menus;for(var e in i)Object.prototype.hasOwnProperty.call(i,e)&&i[e].hide();switch(t){case"goods":i.goods.setOptions(this.game.player.getGoodsMenu()),i.goods.show(),i.base.show();break;case"equip":case"status":case"base":i.base.show()}},s.prototype.enter=function(){this.setState("base")},s.prototype.update=function(){},s.prototype.onBaseMenu=function(t){this.setState(t.id)},s.prototype.onGoodsMenu=function(t){},s.prototype.onCancel=function(){switch(this.state){case"goods":case"equip":case"status":this.setState("base");break;case"base":this.game.state.switch("world")}},s.prototype.draw=function(t,i){this.game.state.world.draw(t,i);for(var e in this.menus)Object.prototype.hasOwnProperty.call(this.menus,e)&&this.menus[e].draw(t,i)},s.prototype.event=function(t,i,e){for(var s in this.menus)if(Object.prototype.hasOwnProperty.call(this.menus,s)&&this.menus[s].event(t,i,e))return;"click"===t&&this.onCancel()},t.exports=s},function(t,i){function e(t){this.game=t,this.x=0,this.y=Math.floor(t.getHeight()/4),this.width=Math.floor(t.getWidth()),this.height=Math.floor(t.getHeight()/2),this.pattern=t.resources.pattern,this.visible=!0,this.t=0}e.prototype.update=function(){this.visible&&this.t++},e.prototype.draw=function(t){if(this.visible){var i=this.pattern;this.drawLayer(t,{pattern:i,A:30,F:.03,S:.04}),t.globalAlpha=.5,this.drawLayer(t,{pattern:i,A:20,F:.02,S:.07}),t.globalAlpha=1}},e.prototype.drawLayer=function(t,i){for(var e=this.t,s=this.width,n=this.height,o=this.x,h=this.y,r=i.A,a=i.F,c=i.S,u=i.pattern,l=u.height,p=0;p<n;p++){var f=r*Math.sin(a*p+c*e);t.drawImage(u,Math.floor((f+160)%s),p%l,s,1,o,h+p,s,1)}},t.exports=e},function(t,i){function e(t,i,e,s,n){this.x=i,this.y=e,this.width=s,this.lineCount=n,this.lineHeight=16,this.font=t,this.visible=!1,this.reset(),this.callback=null}e.prototype.show=function(){this.visible=!0},e.prototype.hide=function(){this.visible=!1},e.prototype.showText=function(t,i){this.buffer+=t,this.finished=!1,this.callback=i,this.show()},e.prototype.update=function(){this.visible&&++this.tick%3==0&&this.onTick()},e.prototype.onTick=function(){this.lines.length&&this.lines[this.cursorLine].length>this.cursorPos?this.cursorPos++:this.buffer.length>0?(this.lines.length===this.lineCount&&this.lines.shift(),this.lines.push(this.getNextLine()),this.cursorLine=this.lines.length-1,this.cursorPos=0):this.finished||(this.finished=!0)},e.prototype.getNextLine=function(){for(var t,i="",e=this.buffer.split(" "),s=!1,n=0,o=this.font;!s&&e[n];)t=o.measureText(i+e[n]+" "),t>this.width?s=!0:(i+=e[n]+" ",n++);return this.buffer=this.buffer.substr(i.length),i},e.prototype.draw=function(t){if(this.visible){var i,e,s=this.font,n=this.width,o=this.lineCount,h=this.lineHeight,r=this.x,a=this.y,c=this.lines,u=this.cursorLine,l=this.cursorPos;for(t.fillStyle="black",t.fillRect(this.x-8,this.y-8,n+16,o*h+16),e=0;e<c.length;e++)i=c[e],u===e&&(i=i.substr(0,l)),s.drawText(t,i,r,a),a+=h;if(this.finished){var p=this.y+o*h+Math.floor(this.tick/10)%3,f=this.x+n/2;t.fillStyle="white",t.beginPath(),t.moveTo(f-5,p),t.lineTo(f+5,p),t.lineTo(f,p+5),t.fill()}}},e.prototype.reset=function(){this.hide(),this.buffer="",this.lines=[],this.cursorLine=0,this.cursorPos=0,this.tick=0},e.prototype.flush=function(){for(;this.buffer.length>0;)this.lines.length===this.lineCount&&this.lines.shift(),this.lines.push(this.getNextLine()),this.cursorLine=this.lines.length-1,this.cursorPos=this.lines[this.cursorLine].length;this.finished=!0},e.prototype.action=function(){this.finished?this.done():this.flush()},e.prototype.event=function(t){this.visible&&"click"===t&&this.action()},e.prototype.done=function(){if(this.callback){var t=this.callback;this.callback=null,t()}},t.exports=e},function(t,i,e){function s(t){this.game=t,this.color={r:0,b:0,g:0},this.width=t.getWidth(),this.height=t.getHeight(),this.visible=!1,this.alpha=0,this.tween=new n}var n=e(20);s.prototype.fadeIn=function(t,i){var e=this;this.tween.start(this,"alpha","linear",1,0,t,function(){e.visible=!1,i()})},s.prototype.fadeOut=function(t,i){this.visible=!0,this.tween.start(this,"alpha","linear",0,1,t,i)},s.prototype.update=function(){this.visible&&this.tween.update()},s.prototype.draw=function(t){if(this.visible){var i=this.color,e=this.alpha;t.fillStyle="rgba("+i.r+", "+i.g+", "+i.b+", "+e+")",t.fillRect(0,0,this.width,this.height)}},t.exports=s},function(t,i){function e(t,i){this.commands=t,this.conditions=i}e.prototype.run=function(t,i,e){this.ip=0,this.lines=t,this.done=e,this.context=i,this.inc=this.inc.bind(this),this.next()},e.prototype.next=function(){this.ip<this.lines.length?this.exec(this.lines[this.ip]):this.done()},e.prototype.inc=function(t){t?this.done(t):(this.ip++,this.next())},e.prototype.jump=function(t){do{this.ip++}while(this.ip<this.lines.length&&-1===t.indexOf(this.lines[this.ip].cmd))},e.prototype.keywords={if:function(t){this.conditions[t.cond](this.context,t)?this.inc():(this.jump(["else","endif"]),this.inc())},else:function(t){this.jump(["endif"]),this.inc()},endif:function(t){this.inc()}},e.prototype.exec=function(t){var i=this.keywords[t.cmd];i?i.call(this,t):this.commands[t.cmd](this.context,t,this.inc)},t.exports=e},function(t,i){function e(t,i,e){var s=this;this.game=t,Object.keys(i).forEach(function(t){s[t]=i[t]}),this.currentState=i[e]}e.prototype.switch=function(t,i){var e=this.currentState;e&&e.exit&&e.exit();var s=this[t];s&&s.enter&&s.enter(i),this.currentState=s},e.prototype.update=function(){var t=this.currentState;t&&t.update&&t.update()},e.prototype.draw=function(t,i){var e=this.currentState;e&&e.update&&e.draw(t,i)},e.prototype.event=function(t,i,e){var s=this.currentState;s&&s.event&&s.event(t,i,e)},t.exports=e},function(t,i){function e(){this.playing=!1,this.s=0,this.e=0,this.x=0,this.frames=0,this.target=null,this.prop=null,this.done=null}var s={linear:function(t){return t},smoothstep:function(t){return t*t*(3-2*t)},smoothstepSquared:function(t){return Math.pow(t*t*(3-2*t),2)},smoothstepCubed:function(t){return Math.pow(t*t*(3-2*t),3)},acceleration:function(t){return t*t},accelerationCubed:function(t){return Math.pow(t*t,3)},deceleration:function(t){return 1-Math.pow(1-t,2)},decelerationCubed:function(t){return 1-Math.pow(1-t,3)},sine:function(t){return Math.sin(t*Math.PI/2)},sineSquared:function(t){return Math.pow(Math.sin(t*Math.PI/2),2)},sineCubed:function(t){return Math.pow(Math.sin(t*Math.PI/2),2)},inverseSine:function(t){return 1-Math.sin((1-t)*Math.PI/2)},inverseSineSquared:function(t){return 1-Math.pow(Math.sin((1-t)*Math.PI/2),2)},inverseSineCubed:function(t){return 1-Math.pow(Math.sin((1-t)*Math.PI/2),3)}};e.prototype.start=function(t,i,e,n,o,h,r){this.target=t,this.prop=i,this.ease=s[e],this.s=n,this.e=o,this.x=0,this.frames=h,this.done=r,this.playing=!0},e.prototype.update=function(){if(this.playing&&this.target)if(this.x<this.frames){var t=this.x/this.frames,i=this.ease(t);this.target[this.prop]=this.e*i+this.s*(1-i),this.x++}else if(this.playing=!1,this.done){var e=this.done;this.done=null,e()}},t.exports=e},function(t,i){function e(t,i,e,s){this.width=t,this.height=i,this.x=e||0,this.y=s||0}e.prototype.update=function(t,i){this.x=t.x-this.width/2,this.y=t.y-this.height/2,this.x<0&&(this.x=0),this.y<0&&(this.y=0),this.x+this.width>i.width&&(this.x=i.width-this.width),this.y+this.height>i.height&&(this.y=i.height-this.height)},t.exports=e},function(t,i,e){function s(t){this.game=t,this.player=new n(this,{x:150,y:180,frame:0}),this.events=[{x:150,y:205,z:0,width:16,height:8,frame:1,eventId:1},{x:355,y:220,z:0,width:16,height:8,frame:1,eventId:2},{x:175,y:235,z:0,width:16,height:8,frame:1,eventId:3}],this.enemies=[new o(this,{x:320,y:120,frame:2})],this.entities=[].concat([this.player],this.events,this.enemies),this.walls=[{x:0,y:0,width:440,height:100},{x:0,y:0,width:75,height:372},{x:0,y:280,width:300,height:150},{x:300,y:340,width:140,height:60},{x:390,y:0,width:200,height:290},{x:100,y:100,width:150,height:65},{x:60,y:230,width:40,height:100},{x:190,y:240,width:110,height:40},{x:240,y:210,width:70,height:30}],this.width=440,this.height=372,this.correctionWall=this.correctionWall.bind(this),this.collideEvent=this.collideEvent.bind(this),this.collideEnemy=this.collideEnemy.bind(this)}var n=e(9),o=e(7),h=e(2);s.prototype.draw=function(t,i,e){var s=this.player,n=this.entities;t.drawImage(e.world,i.x,i.y,i.width,i.height,0,0,i.width,i.height),n.sort(function(t,i){return t.y-i.y}),n.forEach(function(s){s.dead||(t.fillStyle="rgba(170, 170, 170, 0.5)",t.beginPath(),t.ellipse(s.x+s.width/2-i.x,s.y+s.height/2-i.y,s.width/2,s.height/2,0,0,2*Math.PI),t.fill(),t.closePath(),t.drawImage(e.sprites,16*s.frame,0,16,24,s.x-i.x|0,s.y-20-s.z-i.y|0,s.width,24))}),s.goalRadius>0&&(t.fillStyle="rgba(170, 170, 170, 0.5)",t.beginPath(),t.ellipse(s.goalX+8-i.x,s.goalY+4-i.y,s.goalRadius,s.goalRadius,0,0,2*Math.PI),t.fill(),t.closePath())},s.prototype.update=function(){var t=this,i=this.player;this.walls.forEach(function(e){h.collision(i,e,t.correctionWall)}),this.events.forEach(function(e){h.collision(i,e,t.collideEvent)}),this.enemies.forEach(function(e){e.dead||(e.update(),h.collision(i,e,t.collideEnemy))})},s.prototype.correctionWall=function(t,i,e,s,n,o){n>o?t.x+=(e>0?1:-1)*n:t.y+=(s>0?1:-1)*o},s.prototype.collideEvent=function(t,i,e,s,n,o){if(n>o?t.x+=(e>0?1:-1)*n:t.y+=(s>0?1:-1)*o,i.eventId&&t.goalEvent===i){t.going=!1,t.goalEvent=null;var h=this.game.config.events[i.eventId][0].commands;this.game.state.switch("cutscene",h)}},s.prototype.collideEnemy=function(t,i,e,s,n,o){n>o?t.x+=(e>0?1:-1)*n:t.y+=(s>0?1:-1)*o,t.going=!1,t.goalEvent=null,i.dead=!0,this.game.state.switch("battlemenu",i)},t.exports=s},function(t,i,e){t.exports=e(3)}]);
//# sourceMappingURL=app.js.map