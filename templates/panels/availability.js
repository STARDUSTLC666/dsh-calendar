const AVAILABILITY_CSS = `
.calendar-workbench .calendar-availability,.dshc-root .calendar-availability{border:1px solid var(--w-border,var(--dsh-border-color,#ddd));border-radius:10px;padding:20px;margin:18px 0;background:var(--w-bg,transparent)}
.calendar-availability h3{margin:0;font-size:17px}.calendar-availability .availability-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.calendar-availability p{font-size:13px;line-height:1.7;margin:10px 0;color:var(--w-muted,inherit)}
.calendar-availability .availability-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:18px 0}.calendar-availability label{display:grid;gap:6px;font-size:13px;min-width:0;align-content:start}.calendar-availability input{width:100%;min-width:0;box-sizing:border-box;font:inherit;color:inherit;background:var(--w-bg,transparent);border:1px solid var(--w-border,#ccc);border-radius:7px;padding:9px}
.calendar-availability fieldset{border:0;padding:0;margin:16px 0;min-width:0}.calendar-availability legend{font-size:13px;margin-bottom:8px}.calendar-availability .availability-days{display:flex;gap:12px;flex-wrap:wrap}.calendar-availability .availability-days label{display:flex;align-items:center;gap:6px}.calendar-availability input[type=checkbox]{width:auto;margin:0}.calendar-availability .availability-actions{display:flex;gap:10px;flex-wrap:wrap}.calendar-availability ol{padding:0;list-style:none;display:grid;gap:8px;margin:14px 0 0}.calendar-availability li{display:flex;justify-content:space-between;align-items:center;gap:12px;border-top:1px solid var(--w-border,#ddd);padding:10px 0;font-size:13px}.calendar-availability li span{min-width:0;overflow-wrap:anywhere}.calendar-availability [role=alert]{color:var(--dsw-alias-state-error-primary,#ad3636)}
@container dsh-workbench (max-width:760px){.calendar-availability .availability-fields{grid-template-columns:minmax(0,1fr)}.calendar-availability{padding:14px!important}.calendar-availability li{align-items:flex-start;flex-direction:column}}
@media(max-width:600px){.calendar-availability .availability-fields{grid-template-columns:minmax(0,1fr)}}
`;

function AvailabilityPanel({anchor,onClose,onChoose,onBusy}) {
  const text=calendarText, dayString=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const zone=Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const [form,setForm]=React.useState(()=>{const now=new Date(),start=anchor>now?new Date(anchor):now,end=new Date(start);end.setDate(end.getDate()+6);return{from:dayString(start),to:dayString(end),durationMinutes:'60',workStart:'09:00',workEnd:'18:00',bufferMinutes:'0',weekdays:[1,2,3,4,5]}});
  const [result,setResult]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false),active=React.useRef({id:0,controller:null});
  React.useEffect(()=>{onBusy(busy);return()=>onBusy(false)},[busy]);
  React.useEffect(()=>()=>{active.current.id++;active.current.controller?.abort()},[]);
  const cancel=()=>{active.current.id++;active.current.controller?.abort();active.current.controller=null;setBusy(false)};
  const close=()=>{cancel();onClose()};
  const update=fields=>{cancel();setForm(value=>({...value,...fields}));setResult(null);setError('')};
  const search=async event=>{
    event.preventDefault();cancel();const controller=new AbortController(),id=++active.current.id;active.current.controller=controller;setBusy(true);setError('');setResult(null);
    try{
      const start=new Date(form.from+'T00:00:00'),end=new Date(form.to+'T00:00:00');end.setDate(end.getDate()+1);
      if(dayString(new Date())===form.from)start.setTime(Math.max(start.getTime(),Date.now()));
      const value=await api('availability',{start:start.toISOString(),end:end.toISOString(),timeZone:zone,durationMinutes:Number(form.durationMinutes),workStart:form.workStart,workEnd:form.workEnd,weekdays:form.weekdays,bufferMinutes:Number(form.bufferMinutes),limit:20},controller.signal);
      if(active.current.id===id)setResult(value);
    }catch(e){if(active.current.id===id&&!controller.signal.aborted){const message=e?.message || String(e);setError(UI_LANG==='en'&&/范围|31 天/.test(message)?'Choose an increasing date range of up to 31 days.':backendMessage(e))}}
    finally{if(active.current.id===id){active.current.controller=null;setBusy(false)}}
  };
  const field=(key,label,type,extra={})=>h('label',{key},[h('span',{key:'label'},label),h('input',{key:'input',type,value:form[key],disabled:busy,onChange:e=>update({[key]:e.target.value}),required:true,...extra})]);
  const weekdays=UI_LANG==='en'?['Mon','Tue','Wed','Thu','Fri','Sat','Sun']:['周一','周二','周三','周四','周五','周六','周日'];
  const formatter=React.useMemo(()=>new Intl.DateTimeFormat(UI_LANG==='en'?'en-US':'zh-CN',{timeZone:zone,year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'shortOffset'}),[UI_LANG,zone]);
  const format=iso=>formatter.format(new Date(iso));
  return h('section',{className:'calendar-availability','aria-label':text('找空闲时段','Find available time'),'aria-busy':busy,onKeyDown:e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close()}}},[
    h('style',{key:'style'},AVAILABILITY_CSS),h('div',{key:'heading',className:'availability-heading'},[h('h3',{key:'title'},text('找空闲时段','Find available time')),h(W.Button,{key:'close',onClick:close},text('关闭','Close'))]),
    h('p',{key:'scope'},text('按当前连接的日历查找，不代表其他日历或参会者空闲。选择候选只填写新建草稿。','Checks the connected calendar, not other calendars or attendees. Choosing a time only fills a new-event draft.')),
    h('p',{key:'zone'},text('查询与显示时区：','Search and display time zone: ')+zone),
    h('form',{key:'form',onSubmit:search},[
      h('div',{key:'fields',className:'availability-fields'},[field('from',text('开始日期','Start date'),'date'),field('to',text('结束日期（包含当天）','End date (inclusive)'),'date'),field('durationMinutes',text('日程时长（分钟）','Duration (minutes)'),'number',{min:5,max:480,step:1}),field('workStart',text('工作开始','Work starts'),'time'),field('workEnd',text('工作结束','Work ends'),'time'),field('bufferMinutes',text('定时日程前后缓冲（分钟）','Buffer around timed events (minutes)'),'number',{min:0,max:120,step:1})]),
      h('fieldset',{key:'weekdays',disabled:busy},[h('legend',{key:'legend'},text('工作日','Working days')),h('div',{key:'days',className:'availability-days'},weekdays.map((label,i)=>h('label',{key:i},[h('input',{key:'check',type:'checkbox',checked:form.weekdays.includes(i+1),onChange:e=>update({weekdays:e.target.checked?[...form.weekdays,i+1]:form.weekdays.filter(v=>v!==i+1)})}),label])))]),
      h('div',{key:'actions',className:'availability-actions'},[h(W.Button,{key:'search',type:'submit',variant:'primary',disabled:busy},busy?text('正在查询…','Searching…'):text('查找空闲','Find times')),busy?h(W.Button,{key:'cancel',onClick:cancel},text('取消查询','Cancel search')):null])]),
    error?h('p',{key:'error',role:'alert'},error):null,
    result?h('div',{key:'results','aria-live':'polite'},[h('p',{key:'checked'},text('读取于 ','Checked at ')+format(result.checkedAt)+text('，已核对 ',' · Checked ')+result.busyEventCount+text(' 个占用日程。候选尚未预约，可相互重叠。',' busy events. Candidates are not reserved and may overlap.')),
      result.count?h('ol',{key:'slots'},result.slots.map(slot=>h('li',{key:slot.start},[h('span',{key:'range'},format(slot.start)+' — '+format(slot.end)),h(W.Button,{key:'choose',onClick:()=>onChoose(slot)},text('用此时段新建','Create with this time'))]))):h('p',{key:'empty',role:'status'},text('查询范围内没有符合条件的空闲时段。可缩短时长、减少缓冲或调整工作时间后重试。','No available times match. Try a shorter duration, less buffer or different working hours.')),
      result.hasMore?h('p',{key:'more'},text('仅显示最早 20 个候选，可缩小日期范围后再查。','Showing the earliest 20 candidates. Narrow the date range to refine the results.')):null]):null,
  ]);
}
