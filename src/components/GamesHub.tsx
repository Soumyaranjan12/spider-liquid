import { useCallback, useEffect, useRef, useState } from 'react'
import { Chess, type Square } from 'chess.js'
import { Gamepad2, Copy, Link2, Users, Wifi, WifiOff, Trophy, RotateCcw, Target, Zap, Shield, Bot, Check, ArrowUpRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { trackEvent } from '../utils/analytics'

export type MiniGameId = 'snake' | 'chess' | 'pen'
type GameMode = 'single' | 'multiplayer'
type PeerMessage = { kind: string; game?: string; _receivedAt?: string; [key: string]: unknown }
type PeerRole = 'host' | 'guest' | null
type RoomState = { selfId: string; inviteId: string; role: PeerRole; status: string; connected: boolean; error: string }

const pens = [
  { name: 'Cello Gripper', color: '#ff575e', power: 1.0, tier: 1 },
  { name: 'Cello Pointec', color: '#57a7ff', power: 1.03, tier: 2 },
  { name: 'Reynolds 045', color: '#d7dbe5', power: 1.06, tier: 3 },
  { name: 'Reynolds Racer Gel', color: '#b3a1ff', power: 1.08, tier: 4 },
  { name: 'Flair Writo-meter', color: '#ffbd66', power: 1.1, tier: 5 },
  { name: 'Flair Creative', color: '#ff83c0', power: 1.12, tier: 6 },
  { name: 'Montex Mega Top', color: '#67e0b3', power: 1.14, tier: 7 },
  { name: 'Linc Glycer', color: '#75d9ef', power: 1.16, tier: 8 },
  { name: 'Linc Ocean Gel', color: '#618dff', power: 1.18, tier: 9 },
  { name: 'Hauser XO', color: '#e9e1d2', power: 1.2, tier: 10 },
  { name: 'Luxor Pilot Hi-Tecpoint', color: '#ff666e', power: 1.22, tier: 11 },
  { name: 'Rorito Fanta Flo', color: '#c8ef75', power: 1.24, tier: 12 },
  { name: 'Pentonic B-RT', color: '#ff9a67', power: 1.27, tier: 13 },
  { name: 'Nataraj 621', color: '#f5cf52', power: 1.3, tier: 14 }
]
type PenShot = { x:number;y:number;vx:number;vy:number;side:'panda'|'spider';color:string;age:number;resolved:boolean }
const pieceGlyph: Record<string, string> = { p:'♟', n:'♞', b:'♝', r:'♜', q:'♛', k:'♚' }

function usePeerRoom() {
  const peerRef = useRef<import('peerjs').Peer | null>(null)
  const connectionRef = useRef<import('peerjs').DataConnection | null>(null)
  const [room, setRoom] = useState<RoomState>({ selfId:'', inviteId:'', role:null, status:'Not connected', connected:false, error:'' })
  const [incoming, setIncoming] = useState<PeerMessage | null>(null)

  const attachConnection = useCallback((connection: import('peerjs').DataConnection, role: Exclude<PeerRole, null>) => {
    connectionRef.current = connection
    connection.on('open', () => {
      setRoom(previous => ({ ...previous, role, connected:true, status:'Opponent connected', error:'' }))
      connection.send({ kind:'room-hello', at:Date.now() })
    })
    connection.on('data', data => {
      if (data && typeof data === 'object') setIncoming({ ...(data as Record<string, unknown>), _receivedAt: `${Date.now()}-${Math.random()}` } as PeerMessage)
    })
    connection.on('close', () => setRoom(previous => ({ ...previous, connected:false, status:'Opponent disconnected' })))
    connection.on('error', error => setRoom(previous => ({ ...previous, error:error.message || 'Connection error', status:'Connection error' })))
  }, [])

  const createRoom = useCallback(async () => {
    try {
      setRoom(previous => ({ ...previous, status:'Connecting to match service…', error:'', connected:false }))
      if (peerRef.current && !peerRef.current.destroyed) peerRef.current.destroy()
      const { Peer } = await import('peerjs')
      const peer = new Peer()
      peerRef.current = peer
      peer.on('open', id => setRoom({ selfId:id, inviteId:id, role:'host', status:'Waiting for opponent', connected:false, error:'' }))
      peer.on('connection', connection => attachConnection(connection, 'host'))
      peer.on('error', error => setRoom(previous => ({ ...previous, error:error.message || error.type || 'Unable to connect to the match service', status:'Connection error' })))
      peer.on('disconnected', () => setRoom(previous => ({ ...previous, status:previous.connected ? 'Match connected · signaling reconnecting' : 'Disconnected from match service' })))
    } catch (error) {
      setRoom(previous => ({ ...previous, status:'Unable to create room', error:error instanceof Error ? error.message : 'Could not load multiplayer support' }))
    }
  }, [attachConnection])

  const joinRoom = useCallback(async (targetId: string) => {
    const target = targetId.trim()
    if (!target) {
      setRoom(previous => ({ ...previous, error:'Paste a room code or open the full invitation link.' }))
      return
    }
    try {
      setRoom(previous => ({ ...previous, inviteId:target, status:'Connecting to opponent…', connected:false, role:null, error:'' }))
      if (peerRef.current && !peerRef.current.destroyed) peerRef.current.destroy()
      const { Peer } = await import('peerjs')
      const peer = new Peer()
      peerRef.current = peer
      peer.on('open', id => {
        setRoom(previous => ({ ...previous, selfId:id, inviteId:target, role:'guest', status:'Connecting to opponent…' }))
        attachConnection(peer.connect(target, { reliable:true }), 'guest')
      })
      peer.on('error', error => setRoom(previous => ({ ...previous, error:error.message || error.type || 'Unable to join room', status:'Connection error' })))
    } catch (error) {
      setRoom(previous => ({ ...previous, status:'Unable to join room', error:error instanceof Error ? error.message : 'Could not load multiplayer support' }))
    }
  }, [attachConnection])

  const send = useCallback((message: PeerMessage) => {
    if (connectionRef.current?.open) connectionRef.current.send(message)
  }, [])

  const disconnect = useCallback(() => {
    connectionRef.current?.close()
    connectionRef.current = null
    if (peerRef.current && !peerRef.current.destroyed) peerRef.current.destroy()
    peerRef.current = null
    setRoom({ selfId:'', inviteId:'', role:null, status:'Not connected', connected:false, error:'' })
  }, [])

  useEffect(() => () => {
    connectionRef.current?.close()
    peerRef.current?.destroy()
  }, [])

  return { room, incoming, createRoom, joinRoom, send, disconnect }
}

type RoomApi = ReturnType<typeof usePeerRoom>

function RoomPanel({ game, api, initialRoom }: { game:'chess'|'pen'; api:RoomApi; initialRoom:string }) {
  const [joinCode, setJoinCode] = useState(initialRoom)
  const [copied, setCopied] = useState(false)
  const invite = api.room.inviteId && typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?game=games&mini=${game}&room=${api.room.inviteId}`
    : ''
  const copy = async () => {
    if (!invite) return
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(invite)
      else throw new Error('Clipboard API unavailable')
      setCopied(true)
    } catch {
      const input = document.createElement('textarea')
      input.value = invite
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      const ok = document.execCommand('copy')
      input.remove()
      setCopied(ok)
    }
    window.setTimeout(() => setCopied(false), 2400)
  }
  return <div className="room-panel">
    <div className="room-status"><span className={api.room.connected ? 'room-live-dot is-live' : 'room-live-dot'} /><div><b>{api.room.connected ? "You’re connected" : api.room.status}</b><small>{api.room.connected ? 'Peer-to-peer data connection is open.' : 'Create a room or join a friend with their invite code.'}</small></div><span className="room-status-icon">{api.room.connected ? <Wifi size={16}/> : <WifiOff size={16}/>}</span></div>
    <div className="room-actions"><button className="room-primary" onClick={api.createRoom}><Users size={15}/> Create invite room</button><div className="room-join"><input aria-label="Room code" placeholder="Paste friend’s room ID" value={joinCode} onChange={e=>setJoinCode(e.target.value)} /><button onClick={()=>api.joinRoom(joinCode)}>Join <ChevronRight size={14}/></button></div></div>
    {invite && api.room.role === 'host' && <div className="invite-row"><div><span>INVITE LINK</span><code>{invite}</code></div><button onClick={copy}>{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy link'}</button></div>}
    {api.room.error && <p className="room-error">{api.room.error}</p>}
    <p className="room-footnote">Online play uses WebRTC peer-to-peer connections with PeerJS Cloud signaling. Both players need a modern browser and a working internet connection.</p>
  </div>
}

export default function GamesHub({ initialGame = 'snake', initialRoom = '' }: { initialGame?: string; initialRoom?: string }) {
  const [game, setGame] = useState<MiniGameId>(isMiniGame(initialGame) ? initialGame : 'snake')
  const api = usePeerRoom()
  useEffect(() => {
    if (initialRoom) void api.joinRoom(initialRoom)
  }, [initialRoom, api.joinRoom])
  return <section className="subpage games-page">
    <div className="subpage-heading games-heading"><div className="section-kicker">SPIDERPANDA ARCADE</div><h1>Pick your <span>challenge.</span></h1><p>Three different ways to play. Solo progress stays on this device; multiplayer matches connect directly between browsers.</p></div>
    <div className="games-switcher">{([
      {id:'snake' as MiniGameId, name:'Snake', sub:'Reflex & routing', icon:'◉'},
      {id:'chess' as MiniGameId, name:'Panda vs Spider', sub:'Chess · strategy', icon:'♟'},
      {id:'pen' as MiniGameId, name:'Pen Fight', sub:'Physics · skill shots', icon:'✎'}
    ]).map(item=><button key={item.id} className={game===item.id?'active':''} onClick={()=>{setGame(item.id);trackEvent('game_selected',item.id)}}><span className={`game-tab-icon game-tab-${item.id}`}>{item.icon}</span><span><b>{item.name}</b><small>{item.sub}</small></span><ChevronRight size={15}/></button>)}</div>
    <div className="game-stage glass-panel">
      {game==='snake' && <SnakeGame />}
      {game==='chess' && <ChessGame api={api} initialRoom={initialRoom}/>}
      {game==='pen' && <PenFight api={api} initialRoom={initialRoom}/>}
    </div>
    <div className="games-bottom-note"><Shield size={15}/><span>Local scores and unlocks stay in this browser. Invite links let friends connect directly; room signaling is provided by PeerJS Cloud. See <a href="https://peerjs.com/client/faq" target="_blank" rel="noreferrer">how peer-to-peer works ↗</a>.</span></div>
  </section>
}

function isMiniGame(game:string):game is MiniGameId { return game==='snake'||game==='chess'||game==='pen' }

function SnakeGame() {
  const SIZE=18
  const initialSnake=[{x:5,y:9},{x:4,y:9},{x:3,y:9}]
  const [snake,setSnake]=useState(initialSnake)
  const snakeRef=useRef(initialSnake)
  const direction=useRef({x:1,y:0})
  const nextDirection=useRef({x:1,y:0})
  const [food,setFood]=useState({x:12,y:9})
  const foodRef=useRef(food)
  const [running,setRunning]=useState(false)
  const [over,setOver]=useState(false)
  const [score,setScore]=useState(0)
  const [best,setBest]=useState(()=>{try{return Number(localStorage.getItem('spiderpanda.snake.best')||0)}catch{return 0}})
  const speed=Math.max(65,145-score*3)
  const reset=useCallback((start=false)=>{
    const next=[{x:5,y:9},{x:4,y:9},{x:3,y:9}]
    snakeRef.current=next;setSnake(next);direction.current={x:1,y:0};nextDirection.current={x:1,y:0}
    const firstFood={x:12,y:9};foodRef.current=firstFood;setFood(firstFood);setScore(0);setOver(false);setRunning(start)
    if(start)trackEvent('game_started','snake')
  },[])
  useEffect(()=>{
    if(!running)return
    const timer=window.setInterval(()=>{
      const head=snakeRef.current[0],dir=nextDirection.current
      direction.current=dir
      const nextHead={x:head.x+dir.x,y:head.y+dir.y}
      const grows=nextHead.x===foodRef.current.x&&nextHead.y===foodRef.current.y
      const body=grows?snakeRef.current:snakeRef.current.slice(0,-1)
      const collision=nextHead.x<0||nextHead.x>=SIZE||nextHead.y<0||nextHead.y>=SIZE||body.some(part=>part.x===nextHead.x&&part.y===nextHead.y)
      if(collision){setRunning(false);setOver(true);trackEvent('snake_game_over','snake',score);return}
      const next=[nextHead,...body]
      snakeRef.current=next;setSnake(next)
      if(grows){
        setScore(old=>{const value=old+1;trackEvent('snake_point','snake',1);return value})
        let candidate={x:Math.floor(Math.random()*SIZE),y:Math.floor(Math.random()*SIZE)}
        while(next.some(part=>part.x===candidate.x&&part.y===candidate.y))candidate={x:Math.floor(Math.random()*SIZE),y:Math.floor(Math.random()*SIZE)}
        foodRef.current=candidate;setFood(candidate)
      }
    },speed)
    return ()=>window.clearInterval(timer)
  },[running,speed,score])
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{
      const moves:Record<string,{x:number,y:number}>={ArrowUp:{x:0,y:-1},w:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1},ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0}}
      const key=event.key.length===1?event.key.toLowerCase():event.key
      const next=moves[key]
      if(!next)return
      event.preventDefault()
      const current=direction.current
      if(next.x!==-current.x||next.y!==-current.y)nextDirection.current=next
    }
    window.addEventListener('keydown',onKey)
    return ()=>window.removeEventListener('keydown',onKey)
  },[])
  const bodySet=new Set(snake.map(p=>`${p.x},${p.y}`))
  const headSet=`${snake[0]?.x},${snake[0]?.y}`
  return <div className="game-content snake-content">
    <div className="game-title-row"><div><span className="game-eyebrow">01 / REFLEX TRAINING</span><h2>Snake<span>.</span></h2><p>Eat the red sparks. Stay inside the grid. Every point makes the snake a little faster.</p></div><div className="game-score-pills"><div><small>SCORE</small><b>{score.toString().padStart(2,'0')}</b></div><div><small>BEST</small><b>{best.toString().padStart(2,'0')}</b></div></div></div>
    <div className="snake-layout"><div className="snake-board-wrap"><div className="snake-board" role="img" aria-label={`Snake game board. Score ${score}`} style={{gridTemplateColumns:`repeat(${SIZE},minmax(0,1fr))`}}>{Array.from({length:SIZE*SIZE},(_,i)=>{const x=i%SIZE,y=Math.floor(i/SIZE),isSnake=bodySet.has(`${x},${y}`),isHead=headSet===`${x},${y}`,isFood=food.x===x&&food.y===y;return <span key={i} className={`snake-cell ${isSnake?'snake-body':''} ${isHead?'snake-head':''} ${isFood?'snake-food':''}`}>{isHead?'✦':isFood?'•':''}</span>})}</div><div className="snake-board-caption"><span><i/> LIVE GRID</span><span>18 × 18</span></div></div><aside className="game-instructions"><div className="instruction-icon"><Gamepad2 size={18}/></div><h3>{over?'Run ended':running?'Keep moving':'Ready when you are'}</h3><p>{over?'One more run? Your best score stays saved on this device.':'Use the arrow keys or WASD. Don’t reverse directly into your own tail.'}</p><button className="game-primary" onClick={()=>{reset(true)}}>{over?'Play again':running?'Restart run':'Start game'} <ChevronRight size={15}/></button><button className="game-secondary" onClick={()=>{reset(false);try{localStorage.setItem('spiderpanda.snake.best',String(best))}catch{}}}><RotateCcw size={14}/> Reset board</button><div className="dpad"><button aria-label="Move up" onClick={()=>{if(direction.current.y!==1)nextDirection.current={x:0,y:-1}}}>↑</button><div><button aria-label="Move left" onClick={()=>{if(direction.current.x!==1)nextDirection.current={x:-1,y:0}}}>←</button><button aria-label="Move down" onClick={()=>{if(direction.current.y!==-1)nextDirection.current={x:0,y:1}}}>↓</button><button aria-label="Move right" onClick={()=>{if(direction.current.x!==-1)nextDirection.current={x:1,y:0}}}>→</button></div></div><div className="game-best-note"><Trophy size={14}/><span>Personal best: <b>{best}</b></span></div></aside></div>
    {over&&<div className="game-result"><Trophy size={17}/><span>Run complete — you collected {score} {score===1?'spark':'sparks'}.</span><button onClick={()=>{const n=Math.max(best,score);setBest(n);try{localStorage.setItem('spiderpanda.snake.best',String(n))}catch{}}}>Save result</button></div>}
    <div className="game-helper-line"><span>CONTROLS</span> Arrow keys / WASD <i/> <span>TIP</span> Make wide turns before the board gets crowded.</div>
  </div>
}

function ChessGame({api,initialRoom}:{api:RoomApi;initialRoom:string}) {
  const [mode,setMode]=useState<GameMode>(initialRoom?'multiplayer':'single')
  const gameRef=useRef(new Chess())
  const [position,setPosition]=useState(gameRef.current.fen())
  const processedRemote=useRef<string>('')
  const [selected,setSelected]=useState<Square|null>(null)
  const [message,setMessage]=useState('Panda pieces move first.')
  const [history,setHistory]=useState<string[]>([])
  const [lastMove,setLastMove]=useState<{from:Square;to:Square}|null>(null)
  const game=gameRef.current
  const sessionStarted=useRef(false)
  const localColor: 'w'|'b'=mode==='multiplayer'&&api.room.role==='guest'?'b':'w'
  const isMulti=mode==='multiplayer'
  const resetGame=useCallback((notify=false)=>{
    sessionStarted.current=false
    gameRef.current=new Chess();setPosition(gameRef.current.fen());setSelected(null);setHistory([]);setLastMove(null);setMessage('New match. Panda plays first.')
    if(notify)api.send({kind:'chess-reset',game:'chess'})
  },[api.send])
  const applyMove=useCallback((from:Square,to:Square,promotion='q',send=true)=>{
    try {
      if(!sessionStarted.current){trackEvent('game_started','chess');sessionStarted.current=true}
      const move=gameRef.current.move({from,to,promotion})
      setPosition(gameRef.current.fen());setSelected(null);setHistory(gameRef.current.history());setLastMove({from,to})
      trackEvent('chess_move', 'panda-vs-spider')
      if(send&&isMulti)api.send({kind:'chess-move',game:'chess',from,to,promotion})
      if(gameRef.current.isCheckmate())setMessage(`${gameRef.current.turn()==='w'?'Spider':'Panda'} wins by checkmate.`)
      else if(gameRef.current.isDraw())setMessage('Draw — the board has spoken.')
      else setMessage(`${move.color==='w'?'Panda':'Spider'} played ${move.san}.${gameRef.current.isCheck()?' Check!':''}`)
    } catch { setMessage('That move is not legal. Choose a highlighted square.') }
  },[api.send,isMulti])
  useEffect(()=>{
    if(!api.incoming||api.incoming.game!=='chess'||processedRemote.current===api.incoming._receivedAt)return
    processedRemote.current=api.incoming._receivedAt||''
    if(api.incoming.kind==='chess-move'&&typeof api.incoming.from==='string'&&typeof api.incoming.to==='string'){
      applyMove(api.incoming.from as Square,api.incoming.to as Square,typeof api.incoming.promotion==='string'?api.incoming.promotion:'q',false)
    } else if(api.incoming.kind==='chess-reset') resetGame(false)
  },[api.incoming?._receivedAt,applyMove,resetGame])
  useEffect(()=>{
    if(isMulti||gameRef.current.turn()!=='b'||gameRef.current.isGameOver())return
    const timer=window.setTimeout(()=>{
      const legal=gameRef.current.moves({verbose:true})
      if(!legal.length)return
      const captures=legal.filter(move=>move.isCapture())
      const checks=legal.filter(move=>move.san.includes('+')||move.san.includes('#'))
      const pool=captures.length?captures:checks.length?checks:legal
      const move=pool[Math.floor(Math.random()*pool.length)]
      applyMove(move.from,move.to,move.promotion||'q',false)
    },480)
    return ()=>window.clearTimeout(timer)
  },[position,isMulti,applyMove])
  const clickSquare=(square:Square)=>{
    if(game.isGameOver())return
    if(isMulti&&!api.room.connected){setMessage('Create a room or join a friend before moving.');return}
    if(game.turn()!==localColor){setMessage('Wait for the other side to move.');return}
    if(selected){
      const legal=game.moves({square:selected,verbose:true})
      if(legal.some(move=>move.to===square)){applyMove(selected,square);return}
    }
    const piece=game.get(square)
    if(piece&&piece.color===game.turn()){setSelected(square);setMessage(`${square.toUpperCase()} selected. Choose a highlighted destination.`)}
    else setSelected(null)
  }
  const boardSquares=Array.from({length:64},(_,i)=>{
    const row=Math.floor(i/8),col=i%8
    const r=localColor==='b'?7-row:row,c=localColor==='b'?7-col:col
    const square=(`abcdefgh`[c]+String(8-r)) as Square
    const piece=game.get(square)
    const destination=selected?game.moves({square:selected,verbose:true}).some(move=>move.to===square):false
    return {square,piece,row,col,destination}
  })
  return <div className="game-content chess-content">
    <div className="game-title-row"><div><span className="game-eyebrow">02 / CLASSIC STRATEGY</span><h2>Panda <span>vs</span> Spider</h2><p>Full legal chess rules: castling, en passant, promotion, check and checkmate.</p></div><div className="chess-turn-card"><span className={game.turn()==='w'?'panda-piece-dot':'spider-piece-dot'}/><small>TO MOVE</small><b>{game.isGameOver()?'Game over':game.turn()==='w'?'🐼 Panda':'🕷️ Spider'}</b></div></div>
    <div className="game-mode-toggle"><button className={!isMulti?'active':''} onClick={()=>{setMode('single');resetGame(false)}}><Bot size={14}/> Single player</button><button className={isMulti?'active':''} onClick={()=>{setMode('multiplayer');setMessage('Create or join a room to play online.')}}><Users size={14}/> Multiplayer</button></div>
    {isMulti&&<RoomPanel game="chess" api={api} initialRoom={initialRoom}/>}
    <div className="chess-layout"><div className="chess-board-wrap"><div className="chess-board">{boardSquares.map(({square,piece,row,col,destination})=><button key={square} aria-label={`${square} ${piece?piece.color==='w'?'panda piece':'spider piece':'empty'}`} className={`chess-square ${(row+col)%2===0?'light':'dark'} ${selected===square?'is-selected':''} ${destination?'is-destination':''} ${lastMove&&(lastMove.from===square||lastMove.to===square)?'last-move':''}`} onClick={()=>clickSquare(square)}>{col===0&&<small className="rank-label">{square[1]}</small>}{row===7&&<small className="file-label">{square[0]}</small>}{destination&&!piece&&<i className="move-dot"/>}{piece&&<span className={`chess-piece ${piece.color==='w'?'piece-panda':'piece-spider'}`}>{pieceGlyph[piece.type]}</span>}</button>)}</div><div className="chess-board-legend"><span>🐼 PANDA ARMY</span><span>SPIDER ARMY 🕷️</span></div></div><aside className="chess-info-panel"><div className="chess-side-card side-panda"><span>🐼</span><div><b>Panda</b><small>White · moves first</small></div><em>{game.turn()==='w'&&!game.isGameOver()?'TURN':''}</em></div><div className="chess-side-card side-spider"><span>🕷️</span><div><b>Spider</b><small>Black · plays second</small></div><em>{game.turn()==='b'&&!game.isGameOver()?'TURN':''}</em></div><div className="chess-message"><span>GAME STATUS</span><p>{message}</p>{game.isCheck()&&!game.isGameOver()&&<b className="check-warning">CHECK</b>}</div><div className="move-history"><div><b>Move history</b><small>{history.length} half-moves</small></div>{history.length?<ol>{history.slice(-10).map((san,i)=><li key={history.length-i}>{san}</li>)}</ol>:<p>Make the first move to begin.</p>}</div><button className="game-secondary" onClick={()=>resetGame(isMulti)}><RotateCcw size={14}/> {isMulti?'Request rematch':'New game'}</button></aside></div>
    <div className="game-helper-line"><span>HOW TO PLAY</span> Select one of your pieces, then select a highlighted legal square. <i/> <span>SOLO AI</span> A lightweight opponent prioritizes captures and checks.</div>
  </div>
}

function PenFight({api,initialRoom}:{api:RoomApi;initialRoom:string}) {
  const [mode,setMode]=useState<GameMode>(initialRoom?'multiplayer':'single')
  const [level,setLevel]=useState(1)
  const [progress,setProgress]=useState(0)
  const [unlocked,setUnlocked]=useState(()=>{try{return Number(localStorage.getItem('spiderpanda.pen.unlocked')||1)}catch{return 1}})
  const [selectedPen,setSelectedPen]=useState(0)
  const [angle,setAngle]=useState(28)
  const [power,setPower]=useState(11)
  const [scores,setScores]=useState({panda:0,spider:0})
  const [notice,setNotice]=useState('Choose your angle and power, then launch.')
  const [lastResult,setLastResult]=useState<'hit'|'miss'|null>(null)
  const canvasRef=useRef<HTMLCanvasElement|null>(null)
  const shotsRef=useRef<PenShot[]>([])
  const sessionStarted=useRef(false)
  const scoreHandler=useRef<(side:'panda'|'spider')=>void>(()=>{})
  const launchHandler=useRef<(shot:{side:'panda'|'spider';angle:number;power:number;color:string})=>void>(()=>{})
  const currentRole=api.room.role
  const isMulti=mode==='multiplayer'
  const playerSide:'panda'|'spider'=isMulti&&currentRole==='guest'?'spider':'panda'
  const selected= pens[Math.min(selectedPen,pens.length-1)]

  const awardPoint=useCallback((side:'panda'|'spider')=>{
    if(isMulti){
      if(api.room.role!=='host')return
      setScores(previous=>{
        const next={...previous,[side]:previous[side]+1}
        api.send({kind:'pen-score',game:'pen',panda:next.panda,spider:next.spider})
        return next
      })
      trackEvent('pen_point', selected.name, 1)
      if(side===playerSide){setNotice('Direct hit! Point awarded.');setLastResult('hit')}
      return
    }
    if(side!=='panda')return
    trackEvent('pen_point',selected.name,1)
    const next=progress+1
    if(next>=3){
      const upcoming=level+1
      const unlockedCount=Math.min(pens.length,Math.max(unlocked,upcoming))
      setLevel(upcoming)
      setUnlocked(unlockedCount)
      setProgress(0)
      setSelectedPen(Math.min(unlockedCount-1,pens.length-1))
      setNotice(`Level ${level} cleared — ${pens[unlockedCount-1].name} is unlocked and equipped!`)
      trackEvent('pen_level_complete','pen',1)
      try{localStorage.setItem('spiderpanda.pen.unlocked',String(unlockedCount))}catch{}
    } else {
      setProgress(next)
      setNotice(`Direct hit — ${next}/3 points in level ${level}.`)
    }
    setLastResult('hit')
  },[isMulti,api.room.role,api.send,playerSide,selected.name,unlocked,level,progress])
  const launchShot=useCallback((shot:{side:'panda'|'spider';angle:number;power:number;color:string;remote?:boolean})=>{
    if(isMulti&&!shot.remote&&!api.room.connected){setNotice('Connect to a friend first to launch in multiplayer.');return}
    const angleRad=shot.angle*Math.PI/180
    const direction=shot.side==='panda'?1:-1
    if(!sessionStarted.current){trackEvent('game_started','pen');sessionStarted.current=true}
    shotsRef.current.push({x:shot.side==='panda'?52:728,y:264,vx:direction*Math.cos(angleRad)*shot.power,vy:-Math.sin(angleRad)*shot.power,side:shot.side,color:shot.color,age:0,resolved:false})
    setLastResult(null)
    if(!shot.remote&&isMulti)api.send({kind:'pen-launch',game:'pen',side:shot.side,angle:shot.angle,power:shot.power,color:shot.color})
    setNotice(`${shot.side==='panda'?'Panda':'Spider'} launched a ${shot.color} pen.`)
  },[isMulti,api.room.connected,api.send])
  useEffect(()=>{scoreHandler.current=awardPoint},[awardPoint])
  useEffect(()=>{launchHandler.current=shot=>launchShot(shot)},[launchShot])
  useEffect(()=>{
    if(!api.incoming||api.incoming.game!=='pen')return
    if(api.incoming.kind==='pen-launch'&&(api.incoming.side==='panda'||api.incoming.side==='spider')){
      launchHandler.current({side:api.incoming.side,angle:Number(api.incoming.angle)||28,power:Number(api.incoming.power)||11,color:typeof api.incoming.color==='string'?api.incoming.color:'#ff575e',remote:true})
    }
    if(api.incoming.kind==='pen-score'&&typeof api.incoming.panda==='number'&&typeof api.incoming.spider==='number'){
      setScores({panda:api.incoming.panda,spider:api.incoming.spider});setNotice('Score updated by the room host.')
    }
  },[api.incoming?._receivedAt])
  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return
    const ctx=canvas.getContext('2d');if(!ctx)return
    const W=780,H=300,ground=264
    let frame=0
    const draw=()=>{
      ctx.clearRect(0,0,W,H)
      const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#151520');bg.addColorStop(.52,'#17131b');bg.addColorStop(1,'#0c1018');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H)
      ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1
      for(let x=20;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
      for(let y=20;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
      ctx.fillStyle='rgba(255,255,255,.065)';ctx.fillRect(0,ground,W,3)
      ctx.fillStyle='rgba(255,255,255,.025)';ctx.fillRect(0,ground+3,W,H-ground-3)
      const drawTarget=(x:number,color:string,label:string)=>{
        ctx.beginPath();ctx.arc(x,ground-72,37,0,Math.PI*2);ctx.strokeStyle=color;ctx.lineWidth=1.3;ctx.stroke()
        ctx.beginPath();ctx.arc(x,ground-72,24,0,Math.PI*2);ctx.strokeStyle=color+'77';ctx.stroke()
        ctx.beginPath();ctx.arc(x,ground-72,6,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()
        ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='10px monospace';ctx.textAlign='center';ctx.fillText(label,x,ground-18)
      }
      drawTarget(74,'#ff5360','🐼 HOME');drawTarget(W-74,'#8d82ff','🕷️ TARGET')
      // Draw both player pens with a small stylized barrel, nose, clip and highlight.
      const drawPen=(x:number,color:string,flip=1)=>{
        ctx.save();ctx.translate(x,ground-48);ctx.rotate(flip===1?-0.16:Math.PI+0.16)
        ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(-25,-4,50,8,4);ctx.fill()
        ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(-17,-3,28,2)
        ctx.fillStyle='#d7dbe5';ctx.beginPath();ctx.moveTo(25,-3);ctx.lineTo(34,0);ctx.lineTo(25,3);ctx.fill()
        ctx.fillStyle='#30303a';ctx.fillRect(-23,-5,5,10)
        ctx.restore()
      }
      drawPen(74,pens[selectedPen]?.color||pens[0].color,1);drawPen(W-74,'#8d82ff',-1)
      for(const shot of shotsRef.current){
        shot.age++
        shot.x+=shot.vx;shot.y+=shot.vy;shot.vy+=.12
        if(shot.y>ground-2){shot.y=ground-2;shot.vy=-Math.abs(shot.vy)*.48;shot.vx*=.89;if(Math.abs(shot.vy)<1.25)shot.vy=0}
        const targetX=shot.side==='panda'?W-74:74
        const crossed=shot.side==='panda'?shot.x>=targetX:shot.x<=targetX
        if(crossed&&!shot.resolved){
          shot.resolved=true
          const hit=shot.y>ground-142&&shot.y<ground-15
          if(hit)scoreHandler.current(shot.side)
          else {setLastResult('miss');setNotice('Missed the target. Adjust angle or power and try again.')}
        }
        if(shot.age>180||shot.x<-70||shot.x>W+70)shot.age=999
        if(shot.age<999){
          const rotation=Math.atan2(shot.vy,shot.vx)
          ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(rotation)
          ctx.shadowColor=shot.color;ctx.shadowBlur=12
          ctx.fillStyle=shot.color;ctx.beginPath();ctx.roundRect(-24,-4,47,8,3);ctx.fill()
          ctx.shadowBlur=0;ctx.fillStyle='rgba(255,255,255,.8)';ctx.fillRect(-12,-3,23,2)
          ctx.fillStyle='#dee3ed';ctx.beginPath();ctx.moveTo(23,-3);ctx.lineTo(34,0);ctx.lineTo(23,3);ctx.fill()
          ctx.restore()
        }
      }
      shotsRef.current=shotsRef.current.filter(shot=>shot.age<999)
      frame=requestAnimationFrame(draw)
    }
    frame=requestAnimationFrame(draw)
    return ()=>cancelAnimationFrame(frame)
  },[selectedPen])

  const doLaunch=()=>{
    if(isMulti&&!api.room.connected){setNotice('Connect to a friend before launching.');return}
    if(!isMulti&&!canvasRef.current){return}
    launchShot({side:playerSide,angle,power:power*selected.power,color:selected.color})
  }
  return <div className="game-content pen-content">
    <div className="game-title-row"><div><span className="game-eyebrow">03 / PHYSICS DUEL</span><h2>Pen Fight<span>.</span></h2><p>Angle, impulse, gravity and bounce. Aim for the target zone to score.</p></div><div className="pen-level-card"><small>{isMulti?'ONLINE SCORE':'CAMPAIGN LEVEL'}</small><b>{isMulti?`${scores.panda} : ${scores.spider}`:`LEVEL ${level}`}</b><span>{isMulti?'🐼 Panda  /  🕷️ Spider':`${progress}/3 points to unlock`}</span></div></div>
    <div className="game-mode-toggle"><button className={!isMulti?'active':''} onClick={()=>{setMode('single');setScores({panda:0,spider:0});setNotice('Single-player campaign ready.')}}><Bot size={14}/> Campaign</button><button className={isMulti?'active':''} onClick={()=>{setMode('multiplayer');setNotice('Create an invite or join a friend to duel.')}}><Users size={14}/> Online duel</button></div>
    {isMulti&&<RoomPanel game="pen" api={api} initialRoom={initialRoom}/>}
    <div className="pen-arena-wrap"><canvas ref={canvasRef} width={780} height={300} className="pen-arena" aria-label="Pen fight physics arena"/><div className="pen-arena-caption"><span><i/> {isMulti?api.room.connected?'ONLINE MATCH':'WAITING FOR OPPONENT':'PHYSICS SIMULATION'}</span><span>{notice}</span></div></div>
    <div className="pen-control-grid"><div className="pen-aim-controls"><div className="pen-control-heading"><div><span className="mini-label">YOUR THROW</span><h3>Aim & launch</h3></div><button className="game-primary" onClick={doLaunch}><Zap size={15}/> Flick pen</button></div><label className="slider-control"><span>Launch angle <b>{angle}°</b></span><input type="range" min="12" max="55" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label><label className="slider-control"><span>Power <b>{power.toFixed(1)} m/s</b></span><input type="range" min="8" max="13" step=".5" value={power} onChange={e=>setPower(Number(e.target.value))}/></label><div className="pen-physics-badges"><span><ActivityIcon/>Gravity</span><b>0.12</b><span>Restitution</span><b>0.48</b><span>Drag</span><b>0.89</b></div>{lastResult&&<div className={`shot-result ${lastResult}`}>{lastResult==='hit'?'DIRECT HIT · POINT SCORED':'MISS · TUNE YOUR THROW'}</div>}</div><div className="pen-inventory"><div className="pen-control-heading"><div><span className="mini-label">INDIAN STATIONERY CLASSICS</span><h3>Pen collection <span>{isMulti?'14 available':`${unlocked}/14 unlocked`}</span></h3></div></div><div className="pen-grid">{pens.map((pen,index)=>{const locked=!isMulti&&index>=unlocked;return <button key={pen.name} disabled={locked} className={`pen-option ${selectedPen===index?'active':''} ${locked?'locked':''}`} onClick={()=>setSelectedPen(index)} title={locked?`Clear level ${index} to unlock ${pen.name}`:pen.name}><span className="pen-swatch" style={{background:pen.color}}/><span className="pen-option-name">{pen.name}</span>{locked?<span className="pen-lock">LV {index+1}</span>:selectedPen===index?<Check size={13}/>:<span className="pen-power">×{pen.power.toFixed(2)}</span>}</button>})}</div></div></div>
    {!isMulti&&<div className="campaign-progress"><div><Trophy size={16}/><span><b>Level {level}</b><small>Score 3 direct hits to unlock the next Indian classic.</small></span></div><div className="campaign-points">{[0,1,2].map(i=><span key={i} className={i<progress?'filled':''}>{i<progress?'★':'•'}</span>)}</div><span className="campaign-level-pen">Current pen: <b>{pens[Math.min(unlocked-1,pens.length-1)].name}</b></span></div>}
    {isMulti&&<div className="game-helper-line"><span>ONLINE RULES</span> Any of the 14 pens may be selected. Score is owned by the room host and synchronized to the other player. <i/> <span>SHARING</span> Copy the invite link and send it to your friend.</div>}
    {!isMulti&&<div className="game-helper-line"><span>CAMPAIGN RULES</span> Three direct hits clear a level. Each new level unlocks the next pen in the collection. <i/> <span>TIP</span> Higher power extends range; angle changes flight time and bounce.</div>}
  </div>
}
function ActivityIcon(){return <Target size={13}/>}
