const projects = [
  {id:'A', title:'重走长征路', subtitle:'数字交互下的红色记忆', type:'手势交互 / 交互装置 / 体验设计', desc:'基于 Leap Motion 手势交互技术，探索红色展览场景中的数字化展示，让历史叙事成为可参与、可感知的体验。', count:6},
  {id:'B', title:'星宠纪', subtitle:'宠物陪伴 App 的界面与交互设计', type:'UI 设计 / 用户研究 / 交互流程', desc:'面向年轻养宠用户的宠物性格探索与陪伴记录 App。围绕性格探索、情绪记录、互动成长与社区交流，展示用户研究、功能架构、低保真原型及 UI 界面设计，探索结合 VR 的人宠互动体验。', count:8},
  {id:'E', title:'本草慢煎', subtitle:'智能煎药场景下的界面与操作流程', type:'UI 设计 / 智能产品交互', desc:'围绕智能煎药场景，设计连接产品与 App 的操作体验。通过设备管理、方剂选择、煎煮启动与进度反馈等界面，呈现任务流程与设备状态，让操作路径更清晰。', count:6},
  {id:'C', title:'窑色梦华录', subtitle:'宋代五大名窑主题的游戏与体感交互', type:'游戏策划 / 角色设计 / AR 体感交互', desc:'以宋代五大名窑为背景构建游戏世界，围绕修复瓷器碎片与探索地图设计玩法、角色和界面。结合 AR 与 Kinect 体感交互，探索游戏角色与现实空间的联动体验。', count:7},
  {id:'D', title:'淮阳布老虎', subtitle:'让民间记忆拥有新的表达', type:'视觉形象 / 动画设计', desc:'从淮阳布老虎的民间艺术中提取视觉语言，通过形象设计、纹样及衍生应用，探索传统文化的当代表达。', count:5}
];
const projectOrder=['C','B','E','A','D'];
projects.sort((a,b)=>projectOrder.indexOf(a.id)-projectOrder.indexOf(b.id));
const grid=document.querySelector('#project-grid');
projects.forEach((p,i)=>{
 const button=document.createElement('button'); button.className='project'; button.setAttribute('aria-label',`查看${p.title}项目详情`);
 button.innerHTML=`<div class="project-visual"><img src="assets/cover-${p.id}${['B','E'].includes(p.id)?'-ui':''}.webp" alt="${p.title}项目视觉" loading="lazy" width="1500" height="968"><span class="project-arrow" aria-hidden="true">↗</span></div><div class="project-info"><div><h3 class="project-title">${p.title}</h3><p>${p.subtitle}<br>${p.type}</p></div><span class="project-num">0${i+1}</span></div>`;
 button.addEventListener('click',()=>openProject(p,i));grid.append(button);
});
const dialog=document.querySelector('#project-dialog');
const directoryCategories={B:'UI / APP DESIGN',E:'UI / PRODUCT',A:'INTERACTION',C:'GAME / INTERACTION',D:'VISUAL / MOTION'};
const directoryGrid=document.querySelector('#directory-grid');
projects.forEach((project,index)=>{
 const tile=document.createElement('button');tile.type='button';tile.className='directory-item';tile.dataset.project=project.id;
 tile.setAttribute('aria-label',`作品目录：${project.title}，查看完整项目`);
 const cover=`assets/directory-${project.id}.webp`;
 tile.innerHTML=`<span class="directory-meta"><span class="directory-number">0${index+1}</span><span>${directoryCategories[project.id]}</span></span><span class="directory-cover"><img src="${cover}" alt="${project.title}封面" loading="lazy"><span class="directory-open" aria-hidden="true">↗</span><span class="directory-reveal" aria-hidden="true">探索项目</span></span><span class="directory-name">${project.title}</span><span class="directory-type">${project.type}</span><span class="directory-description">${project.subtitle}</span>`;
 tile.addEventListener('click',()=>openProject(project,index));directoryGrid.append(tile);
});
function openProject(p,i){
 document.querySelector('#detail-number').textContent=`0${i+1}`;
 document.querySelector('#detail-type').textContent=p.type;
 document.querySelector('#detail-title').textContent=p.title;
 document.querySelector('#detail-desc').textContent=p.desc;
 const images=document.querySelector('#detail-images');images.className='detail-images';images.replaceChildren();
 // Mount the gallery in an open dialog before starting requests. Native lazy
 // loading inside a hidden dialog can leave pages unrequested in mobile WebViews.
 if(!dialog.open)dialog.showModal();
 dialog.scrollTop=0;
 for(let n=1;n<=p.count;n++){
  const source=`assets/project-pages/${p.id}${n}.jpg`;
  const page=document.createElement('figure');page.className='project-page';page.dataset.state='loading';
  const frame=document.createElement('div');frame.className='project-page-frame';
  const img=document.createElement('img');img.width=2400;img.height=864;img.alt=`${p.title}作品展示 · 第${n}页`;img.loading='eager';img.decoding='async';
  const status=document.createElement('div');status.className='project-page-status';
  const message=document.createElement('p');message.textContent=`正在加载第 ${n} 页…`;
  const retry=document.createElement('button');retry.type='button';retry.textContent='重新加载';retry.hidden=true;retry.setAttribute('aria-label',`重新加载${p.title}第${n}页`);
  status.append(message,retry);frame.append(img,status);
  const caption=document.createElement('figcaption');const number=document.createElement('span');number.textContent=`${String(n).padStart(2,'0')} / ${String(p.count).padStart(2,'0')}`;
  const fullSize=document.createElement('a');fullSize.href=source;fullSize.target='_blank';fullSize.rel='noopener';fullSize.textContent='查看大图 ↗';fullSize.setAttribute('aria-label',`查看${p.title}第${n}页大图`);
  caption.append(number,fullSize);page.append(frame,caption);images.append(page);
  img.addEventListener('load',()=>{page.dataset.state='ready';status.hidden=true;});
  img.addEventListener('error',()=>{page.dataset.state='error';message.textContent='本页暂未加载成功，可重试或查看大图。';status.hidden=false;retry.hidden=false;});
  retry.addEventListener('click',()=>{page.dataset.state='loading';message.textContent=`正在加载第 ${n} 页…`;retry.hidden=true;img.src=`${source}?retry=${Date.now()}`;});
  img.src=source;
 }
}
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
document.querySelector('#close-end').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelector('#year').textContent=new Date().getFullYear();

const filmTitles={red:'重走长征路',cat:'星宠纪',tiger:'淮阳布老虎',diffuse:'影像剪辑'};
const films=['red','cat','tiger','diffuse'];
document.querySelector('#sweet-recharge video').addEventListener('play',event=>document.querySelectorAll('.film video').forEach(video=>{if(video!==event.target)video.pause();}));
films.forEach((file,i)=>{
 const article=document.createElement('article');article.className='film';
 const video=document.createElement('video');video.controls=true;video.preload='none';video.playsInline=true;video.poster=`assets/videos/${file}.jpg`;video.src=`assets/videos/${file}.mp4`;video.setAttribute('aria-label',`${filmTitles[file]} AE与剪辑作品`);
 const fallback=document.createElement('a');fallback.href=video.src;fallback.textContent='打开视频文件';video.append(fallback);
 const info=document.createElement('div');info.className='film-info';info.innerHTML=`<div><h3>${filmTitles[file]}</h3><p>AE 动效 / 视频剪辑</p></div><span>0${i+1}</span>`;
 article.append(video,info);document.querySelector('#video-grid').append(article);
 video.addEventListener('play',()=>document.querySelectorAll('.film video').forEach(other=>{if(other!==video)other.pause();}));
});
const awards=[
 {file:'中国好创意国赛一等奖',ext:'pdf',name:'中国好创意暨全国数字艺术设计大赛',level:'全国总决赛 · 一等奖',category:'红色文化创意设计专项赛'},
 {file:'未来设计师国赛一等奖',ext:'jpg',name:'未来设计师 · 全国高校数字艺术设计大赛',level:'全国总决赛 · 一等奖',category:'第 14 届 NCDA'},
 {file:'中国好创意国赛三等奖',ext:'pdf',name:'中国好创意暨全国数字艺术设计大赛',level:'全国总决赛 · 三等奖',category:'“活路儿”地方非遗生成式人工智能专项赛'},
 {file:'未来设计师省一',ext:'jpg',name:'未来设计师 · 全国高校数字艺术设计大赛',level:'河南赛区 · 一等奖',category:'第 14 届 NCDA · 淮阳布老虎'},
 {file:'未来设计师省一1',ext:'jpg',name:'未来设计师 · 全国高校数字艺术设计大赛',level:'河南赛区 · 一等奖',category:'第 14 届 NCDA · 淮阳虎佑·布承千秋'},
 {file:'哇哈哈大广赛',ext:'jpg',name:'全国大学生广告艺术大赛',level:'河南赛区 · 三等奖',category:'第 18 届 · 视频类影视广告'},
 {file:'IP设计金犊奖优秀奖',ext:'jpg',name:'时报金犊奖',level:'优秀奖',category:'中华文化应用项'},
 {file:'中国好创意优秀奖',ext:'pdf',name:'中国好创意暨全国数字艺术设计大赛',level:'全国总决赛 · 优秀奖',category:'天空盒—文物新生专项大赛'}
];
const awardDialog=document.querySelector('#award-dialog');
awards.forEach((award,i)=>{
 const row=document.createElement('button');row.className='award-row';row.setAttribute('aria-label',`查看${award.name}${award.level}奖状`);
 row.innerHTML=`<span class="award-index">0${i+1}</span><div class="award-thumb"><img src="assets/awards/${award.file}.webp" alt="${award.level}获奖证书缩略图" loading="lazy"></div><div class="award-name"><h3>${award.name}</h3><p>${award.category}</p></div><span class="award-level">${award.level}</span><span class="award-arrow" aria-hidden="true">↗</span>`;
 row.addEventListener('click',()=>{document.querySelector('#award-title').textContent=`${award.name} / ${award.level}`;const img=document.querySelector('#award-image');img.src=`assets/awards/${award.file}.webp`;img.alt=`${award.name} ${award.level}获奖证书`;document.querySelector('#award-original').href=`assets/awards/originals/${award.file}.${award.ext}`;awardDialog.showModal();awardDialog.scrollTop=0;});
 document.querySelector('#award-list').append(row);
});
document.querySelector('#close-award').addEventListener('click',()=>awardDialog.close());
awardDialog.addEventListener('click',e=>{if(e.target===awardDialog){const r=awardDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)awardDialog.close();}});
