import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Save,RotateCcw,ClipboardList,CheckCircle2} from 'lucide-react';
import './styles.css';

const sections=[
['Objetivo',['Qual problema o sistema resolve?','Qual objetivo principal?','Como o sucesso será medido?']],
['Usuários',['Quem utilizará o sistema?','Quais perfis de usuário existem?','Quem cadastra, analisa, acompanha e aprova?','Existem informações restritas por perfil?']],
['Procedimentos',['Quais procedimentos o sistema precisa controlar?','Como um procedimento é iniciado?','Quais etapas existem?','Como o procedimento é encerrado?']],
['Fluxo',['Quem executa cada etapa?','Quais documentos são produzidos?','Existem devoluções, redistribuições ou prorrogações?','O que acontece quando uma etapa é concluída?']],
['Prazos',['Existem prazos legais/regulamentares?','Como começa a contagem?','É necessário alertar sobre vencimentos?','Como identificar processos atrasados?']],
['Documentos',['Quais documentos entram no processo?','Quais documentos são gerados?','Precisa anexar arquivos?','Precisa assinatura digital ou versionamento?']],
['Consulta e relatórios',['Como localizar um procedimento?','Quais filtros são necessários?','Quais relatórios precisam ser gerados?','Quais indicadores o coordenador precisa visualizar?']],
['Segurança e auditoria',['Como será o login?','Existem níveis de acesso?','É necessário registrar quem acessou/alterou?','Existe necessidade de histórico de alterações?']],
['Tecnologia e integrações',['Existe sistema atual ou API?','Quais sistemas externos serão integrados?','Existe Figma/Design System?','Qual stack/arquitetura já foi definida?']],
['Escopo e prazo',['O que obrigatoriamente entra no MVP?','O que está fora do escopo?','Qual prazo?','Quem aprova requisitos e entrega?']]
];
const options=['Não informado','Sim','Não','Parcialmente','Não se aplica'];
function App(){
 const initial=Object.fromEntries(sections.flatMap(([,qs])=>qs.map(q=>[q,'Não informado'])));
 const [answers,setAnswers]=useState(()=>JSON.parse(localStorage.getItem('cpjm-checklist')||'null')||initial);
 const [saved,setSaved]=useState(false);
 const set=(q,v)=>{setAnswers(a=>({...a,[q]:v}));setSaved(false)};
 const save=()=>{localStorage.setItem('cpjm-checklist',JSON.stringify(answers));setSaved(true)};
 const reset=()=>{if(confirm('Limpar todas as respostas?')){localStorage.removeItem('cpjm-checklist');setAnswers(initial);setSaved(false)}};
 const answered=Object.values(answers).filter(v=>v!=='Não informado').length;
 return <div className="app"><header><div className="brand"><ClipboardList size={28}/><div><h1>Checklist CPJM</h1><p>Levantamento de requisitos — reunião</p></div></div><div className="actions"><button className="secondary" onClick={reset}><RotateCcw size={17}/>Limpar</button><button onClick={save}><Save size={17}/>Salvar</button></div></header><main><div className="intro"><div><strong>Objetivo da reunião</strong><span>Registrar rapidamente o que precisa ser descoberto sobre o sistema.</span></div><div className="progress"><b>{answered}</b><span>/ {Object.keys(answers).length} respondidas</span></div></div>{sections.map(([title,qs],i)=><section key={title}><div className="section-title"><span>{String(i+1).padStart(2,'0')}</span><h2>{title}</h2></div>{qs.map(q=><label className="field" key={q}><span>{q}</span><select value={answers[q]} onChange={e=>set(q,e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select></label>)}</section>)}<button className="save-large" onClick={save}><Save size={18}/>Salvar checklist</button>{saved&&<div className="saved"><CheckCircle2 size={18}/>Checklist salvo neste dispositivo.</div>}</main><footer>Checklist CPJM • versão inicial</footer></div>
}
createRoot(document.getElementById('root')).render(<App/>);