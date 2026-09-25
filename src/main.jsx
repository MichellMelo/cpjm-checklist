import React,{useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Save,RotateCcw,ClipboardList,CheckCircle2,ChevronDown} from 'lucide-react';
import './styles.css';

const sections=[
 {title:'Objetivo',questions:[
  {q:'Qual problema o sistema precisa resolver?',type:'textarea',ph:'Descreva o problema atual...'},
  {q:'Qual é o objetivo principal do sistema?',type:'textarea',ph:'Ex.: centralizar, controlar, acompanhar...'},
  {q:'Como saberemos que o sistema deu certo?',type:'textarea',ph:'Quais resultados ou indicadores demonstram sucesso?'}
 ]},
 {title:'Usuários',questions:[
  {q:'Quem utilizará o sistema?',type:'textarea',ph:'Liste setores, funções ou perfis...'},
  {q:'Quais perfis de usuário existirão?',type:'textarea',ph:'Ex.: administrador, analista, gestor...'},
  {q:'Quem cadastra, analisa, acompanha e aprova?',type:'textarea',ph:'Descreva os responsáveis por cada etapa...'},
  {q:'Existem informações com acesso restrito?',type:'select',options:['Ainda não definido','Sim','Não','Depende do perfil']}
 ]},
 {title:'Procedimentos',questions:[
  {q:'Quais procedimentos o sistema precisa controlar?',type:'textarea',ph:'Liste os tipos de procedimentos...'},
  {q:'Como um procedimento é iniciado?',type:'textarea',ph:'Descreva a origem e o primeiro registro...'},
  {q:'Quais etapas existem?',type:'textarea',ph:'Liste as etapas na ordem...'},
  {q:'Como o procedimento é encerrado?',type:'textarea',ph:'Descreva a condição e o registro de encerramento...'}
 ]},
 {title:'Fluxo',questions:[
  {q:'Quem executa cada etapa?',type:'textarea',ph:'Relacione etapa → responsável...'},
  {q:'Quais documentos são produzidos em cada etapa?',type:'textarea',ph:'Liste os documentos...'},
  {q:'Existem devoluções, redistribuições ou prorrogações?',type:'select',options:['Ainda não definido','Sim','Não','Em alguns casos']},
  {q:'O que acontece quando uma etapa é concluída?',type:'textarea',ph:'Próxima etapa, aviso, aprovação, movimentação...'}
 ]},
 {title:'Prazos',questions:[
  {q:'Existem prazos legais ou regulamentares?',type:'select',options:['Ainda não definido','Sim','Não','Para alguns procedimentos']},
  {q:'Como começa a contagem do prazo?',type:'textarea',ph:'Informe o evento que inicia a contagem...'},
  {q:'O sistema deve alertar sobre vencimentos?',type:'select',options:['Ainda não definido','Sim','Não','Somente em casos específicos']},
  {q:'Como identificar processos atrasados?',type:'textarea',ph:'Regra ou informação usada para identificar atraso...'}
 ]},
 {title:'Documentos',questions:[
  {q:'Quais documentos entram no processo?',type:'textarea',ph:'Liste os documentos recebidos...'},
  {q:'Quais documentos são gerados pelo sistema?',type:'textarea',ph:'Liste documentos, relatórios ou peças...'},
  {q:'O sistema precisa permitir anexar arquivos?',type:'select',options:['Ainda não definido','Sim','Não','Somente alguns tipos']},
  {q:'Precisa de assinatura digital ou versionamento?',type:'select',options:['Ainda não definido','Assinatura digital','Versionamento','Ambos','Nenhum']}
 ]},
 {title:'Consulta e relatórios',questions:[
  {q:'Como os usuários precisam localizar um procedimento?',type:'textarea',ph:'Número, nome, unidade, período, status...'},
  {q:'Quais filtros são necessários?',type:'textarea',ph:'Liste os filtros desejados...'},
  {q:'Quais relatórios precisam ser gerados?',type:'textarea',ph:'Liste relatórios e periodicidade...'},
  {q:'Quais indicadores o coordenador precisa visualizar?',type:'textarea',ph:'Ex.: pendentes, atrasados, por unidade...'}
 ]},
 {title:'Segurança e auditoria',questions:[
  {q:'Como será o acesso ao sistema?',type:'select',options:['Ainda não definido','Usuário e senha','SSO institucional','Outro']},
  {q:'Existem níveis diferentes de acesso?',type:'select',options:['Ainda não definido','Sim','Não']},
  {q:'É necessário registrar quem acessou ou alterou informações?',type:'select',options:['Ainda não definido','Sim','Não','Somente alterações']},
  {q:'É necessário manter histórico das alterações?',type:'select',options:['Ainda não definido','Sim','Não']}
 ]},
 {title:'Tecnologia e integrações',questions:[
  {q:'Existe sistema atual ou API que será aproveitado?',type:'textarea',ph:'Nome do sistema, API ou fornecedor...'},
  {q:'Quais sistemas externos precisam ser integrados?',type:'textarea',ph:'Liste sistemas e finalidade da integração...'},
  {q:'Existe Figma ou Design System?',type:'select',options:['Ainda não definido','Sim','Não','Existe referência visual']},
  {q:'A tecnologia/arquitetura já foi definida?',type:'textarea',ph:'Ex.: React, Next.js, API, banco, hospedagem...'}
 ]},
 {title:'Escopo e prazo',questions:[
  {q:'O que obrigatoriamente precisa estar no MVP?',type:'textarea',ph:'Liste as funcionalidades indispensáveis...'},
  {q:'O que está explicitamente fora do escopo?',type:'textarea',ph:'Registre o que não será feito nesta fase...'},
  {q:'Qual é o prazo ou data-alvo?',type:'date'},
  {q:'Quem aprova os requisitos e a entrega?',type:'textarea',ph:'Nome, função ou setor responsável...'}
 ]}
];
const STORAGE='cpjm-checklist-v2';
function buildInitial(){return Object.fromEntries(sections.flatMap(s=>s.questions.map(x=>[x.q,''])));}
function App(){
 const initial=useMemo(buildInitial,[]);
 const [answers,setAnswers]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE));return saved?{...initial,...saved}:initial}catch{return initial}});
 const [saved,setSaved]=useState(false);
 const set=(q,v)=>{setAnswers(a=>({...a,[q]:v}));setSaved(false)};
 const save=()=>{localStorage.setItem(STORAGE,JSON.stringify(answers));setSaved(true)};
 const reset=()=>{if(confirm('Limpar todas as respostas?')){localStorage.removeItem(STORAGE);setAnswers(initial);setSaved(false)}};
 const total=Object.keys(answers).length, answered=Object.values(answers).filter(v=>String(v).trim()!=='').length;
 return <div className="app"><header><div className="brand"><ClipboardList size={28}/><div><h1>Checklist CPJM</h1><p>Levantamento de requisitos — reunião</p></div></div><div className="actions"><button className="secondary" onClick={reset}><RotateCcw size={17}/>Limpar</button><button onClick={save}><Save size={17}/>Salvar</button></div></header><main><div className="intro"><div><strong>Roteiro da reunião</strong><span>As perguntas abertas permitem registrar a resposta real, enquanto as seleções agilizam decisões objetivas.</span></div><div className="progress"><b>{answered}</b><span>/ {total} preenchidas</span></div></div>{sections.map((section,i)=><section key={section.title}><div className="section-title"><span>{String(i+1).padStart(2,'0')}</span><h2>{section.title}</h2></div>{section.questions.map(item=><div className="field" key={item.q}><label htmlFor={item.q}>{item.q}</label>{item.type==='textarea'&&<textarea id={item.q} value={answers[item.q]} onChange={e=>set(item.q,e.target.value)} placeholder={item.ph} rows={3}/>} {item.type==='date'&&<input id={item.q} type="date" value={answers[item.q]} onChange={e=>set(item.q,e.target.value)}/>} {item.type==='select'&&<div className="select-wrap"><select id={item.q} value={answers[item.q]} onChange={e=>set(item.q,e.target.value)}><option value="">Selecione...</option>{item.options.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={17}/></div>}</div>)}</section>)}<button className="save-large" onClick={save}><Save size={18}/>Salvar checklist</button>{saved&&<div className="saved"><CheckCircle2 size={18}/>Checklist salvo neste dispositivo.</div>}</main><footer>Checklist CPJM • versão inicial</footer></div>
}
createRoot(document.getElementById('root')).render(<App/>);