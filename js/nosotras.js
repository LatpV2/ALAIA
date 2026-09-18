const slides=[...document.querySelectorAll('.slide')];
const frame=document.getElementById('slideFrame');
const dots=document.getElementById('slideDots');
const count=document.getElementById('slideCount');
let current=0;
let autoPlay;

slides.forEach((_,i)=>{const b=document.createElement('button');b.className='slide-dot'+(i===0?' active':'');b.setAttribute('aria-label',`Ir a diapositiva ${i+1}`);b.addEventListener('click',()=>goTo(i,i>current?'next':'prev'));dots.appendChild(b)});
const dotEls=[...dots.children];
function render(){slides.forEach((s,i)=>s.classList.toggle('active',i===current));dotEls.forEach((d,i)=>d.classList.toggle('active',i===current));count.textContent=`${current+1} / ${slides.length}`}
function goTo(index,direction='next'){current=(index+slides.length)%slides.length;frame.classList.remove('next','prev');void frame.offsetWidth;frame.classList.add(direction);render()}
function next(){goTo(current+1,'next')}
function prev(){goTo(current-1,'prev')}
document.getElementById('nextSlide').addEventListener('click',()=>{next();restart()});
document.getElementById('prevSlide').addEventListener('click',()=>{prev();restart()});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){next();restart()} if(e.key==='ArrowLeft'){prev();restart()}});
let startX=0;frame.addEventListener('touchstart',e=>startX=e.changedTouches[0].screenX,{passive:true});frame.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-startX;if(Math.abs(dx)>45){dx<0?next():prev();restart()}},{passive:true});
function restart(){clearInterval(autoPlay);autoPlay=setInterval(next,7000)}
restart();
