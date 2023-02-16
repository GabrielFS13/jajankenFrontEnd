import Buttons from '../Buttons'
import './Jogos.css'
import React, { useState, useEffect } from 'react';
const { io } = require("socket.io-client");
const link = process.env.REACT_APP_URL_SOCKET

const socket = io(link, {
    cors:{
        secure: false
    }
});

console.log(link)


const Jogos = () =>{

    const skins = [
        {
            "estilo": "Realista",
            "tesoura": "/img/realista/tesoura.png",
            "pedra": "/img/realista/pedra.png",
            "papel": "/img/realista/papel.png"
        },
        {
            "estilo": "Desenho",
            "tesoura": "/img/desenho/tesoura.png",
            "pedra": "/img/desenho/pedra.png",
            "papel": "/img/desenho/papel.png"
        },
        {
            "estilo": "Meme",
            "tesoura": "/img/meme/tesoura.png",
            "pedra": "/img/meme/pedra.png",
            "papel": "/img/meme/papel.png"
        },
        {
            "estilo": "Minecraft",
            "tesoura": "/img/minecraft/tesoura.png",
            "pedra": "/img/minecraft/pedra.png",
            "papel": "/img/minecraft/papel.png"
        }
    ]
    


    function enviaJogada(jogada){
        setEscolha(jogada)
        setOponente('')
        setInter(true)
        const item = jogada.split('/')
        socket.emit('jogada', {
            sala_code: code,
            skin: item[2],
            item: item[3],
            id: id
         })
        }
    
        function entraSala(e){
            e.preventDefault()
            setCode(e.target[0].value)
            socket.emit("codigo_sala", { codigo: e.target[0].value, id: id })
        }

    function enviaChat(e){

        e.preventDefault()
        socket.emit("chat", {
            nome: id,
            msg: e.target[0].value,
            code: code
        })
        e.target[0].value = ''
        
    }

    useEffect( () =>{  

        socket.on("jogadas", (res) =>{
           console.log(res)
           if(res.status === 'Empate!'){
            setStatus(res.status)
            setOponente(`/img/${res.p1.skin}/${res.p1.item}`)
            setInter(false)
           }else if(res.status === "Esperando oponente..."){
            setStatus(`${res.id} já fez sua jogada!, ${res.status} `)
           }
           else{
            if(res.p1.id === id){
                setOponente(`/img/${res.p2.skin}/${res.p2.item}`)
                setStatus(`${res.p1.id} ${res.status}`)
                setInter(false)
            }else{
                setOponente(`/img/${res.p1.skin}/${res.p1.item}`)
                setStatus(`${res.p1.id} ${res.status}`)
                setInter(false)
            }
           }
        })

        socket.on('logado', (res) =>{
            console.log(res)
            setOponenteID(res.player)
        })

        socket.on("novo_jogador", (res) =>{
            console.log(res)
            setOponenteID(res)

        })
        
        socket.on("RoomCode", (res) =>{
            setCode(res)
        })

        socket.on("revice_msg", (res) =>{
            console.log(res)
            setChat(res)
        })
        
    }, [socket])


    

    const [id, setID] = useState('Guest'+Math.floor(Math.random()*300))
    const [oponenteID, setOponenteID] = useState('')
    const [escolha, setEscolha] = useState('')
    const [opoente, setOponente] = useState('')
    const [status, setStatus] = useState('')
    const [code, setCode] = useState('')
    const [messages, setChat] = useState([])
    const [interrup, setInter] = useState(false)
    const [skin, setSkin] = useState(0)


    return(
        <section className="jogo">
            <form onSubmit={(e) => entraSala(e)}>
                <input type="text" placeholder='Codigo da sala' defaultValue={code} />
                <button className='btn'>Entrar</button>
            </form>
            <div className='placar'>
                <input onChange={(e) => setID(e.target.value)} value={id} className='name-input' />
                <h2>{oponenteID}</h2> 
            </div>
            <div className="escolhas">
                <div className="choice">
                    {escolha ? <img src={escolha} alt="Escolha do jogador!"/> : <h2>Faça a sua jogada!</h2> } 
                </div>
                    X
                <div className="choice">
                    {opoente ? <img src={opoente} alt="Escolha do Oponente" /> :  <h2>Aguardando a sua jogada!</h2> }
                </div>
            </div>
            <div className='Resultado'>
                {status} 
            </div>
            <div className="botoes">
                <Buttons skin={skins[skin]} 
                        jogada={enviaJogada} 
                        desativa ={interrup}
                />
            </div>

            <div className='select-estilo'>
                <select required onChange = {(e) => setSkin(e.target.value)}>
                    {skins.map((skin, i) => <option key={skin.estilo} value={i}>{skin.estilo}</option> )}
                </select>
            </div>
         
           
            
            <div className='chat'>
                
            {messages.map(item => {
                    return(
                        <div className='msg'>
                            <h3 key={item.id}>{item.nome}: </h3>
                            <span key={item.msg}>{item.msg}</span>
                            <br />
                        </div>
                    )
                })}
            
            </div>
            <form onSubmit={(e) => enviaChat(e)}>
                    <input placeholder='Sua mensagem' required/>
                    <button className='chat-btn'>Enviar</button>
                </form> <br />
        </section>
    )
}


export default Jogos