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

    const skins = {
        "realista" :{
            "tesoura": "/img/realista/tesoura.png",
            "pedra": "/img/realista/pedra.png",
            "papel": "/img/realista/papel.png"
        },
        "desenho":{
            "tesoura": "/img/desenho/tesoura.png",
            "pedra": "/img/desenho/pedra.png",
            "papel": "/img/desenho/papel.png"
        }
    }


    function enviaJogada(jogada){
        setEscolha(jogada)
        setOponente('')
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
           }
           else{
            if(res.p1.id === id){
                setOponenteID(res.p2.id)
                setOponente(`/img/${res.p2.skin}/${res.p2.item}`)
                setStatus(`${res.p1.id} ${res.status}`)
            }else{
                setOponenteID(res.p1.id)
                setOponente(`/img/${res.p1.skin}/${res.p1.item}`)
                setStatus(`${res.p1.id} ${res.status}`)
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


    return(
        <section className="jogo">
            <form onSubmit={(e) => entraSala(e)}>
                <input type="text" placeholder='Codigo da sala' defaultValue={code} required/>
                <button>Entrar</button>
            </form>
            <div className='placar'>
                <h2><input onChange={(e) => setID(e.target.value)} value={id} /></h2>
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
                <Buttons skin={skins.realista} 
                        jogada={enviaJogada} 
                />
            </div>
            
            <div className='chat'>
                
            {messages.map(item => {
                    return(
                        <>
                            <u key={item.id}>{item.nome}: </u>
                            <span key={item.msg}>{item.msg}</span>
                            <br />
                        </>
                    )
                })}

            </div>
            <form onSubmit={(e) => enviaChat(e)}>
                    <input placeholder='Sua mensagem' />
                    <button>Enviar</button>
                </form> <br />
        </section>
    )
}


export default Jogos