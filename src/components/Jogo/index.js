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

var nome = ''


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
        },{
            "estilo": "Gon (Hunter X Hunter)",
            "tesoura": "/img/gon/tesoura.png",
            "pedra": "/img/gon/pedra.png",
            "papel": "/img/gon/papel.png"
        },{
            "estilo": "Fortnite",
            "tesoura": "/img/fortnite/tesoura.png",
            "pedra": "/img/fortnite/pedra.png",
            "papel": "/img/fortnite/papel.png"
        },{
            "estilo": "Real",
            "tesoura": "/img/real/tesoura.png",
            "pedra": "/img/real/pedra.png",
            "papel": "/img/real/papel.png"
        }
    ]
    


    function enviaJogada(jogada){
        if(id && code){
            nome = id
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
        }else{
            alert("Entre com um nickname e código de sala!!!")
        }
        
    }
    
        function entraSala(e){
            e.preventDefault()
            if(code === e.target[0].value){
                alert("Você já está nessa sala!")
            }else{
                setCode(e.target[0].value)
                socket.emit("codigo_sala", { codigo: e.target[0].value, id: id })
            }
            
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

    const [id, setID] = useState('')
    const [escolha, setEscolha] = useState('')
    const [opoente, setOponente] = useState('')
    const [status, setStatus] = useState('')
    const [code, setCode] = useState('')
    const [messages, setChat] = useState([])
    const [interrup, setInter] = useState(false)
    const [skin, setSkin] = useState(0)


    
    useEffect( () =>{  

        socket.on("jogadas", (res) =>{
            //regra do backend, p1 sempre é o vencedor
            const vencedor = res.p1.id
            console.log(res)
            console.log("ID: ", nome)
            console.log("Vencedor: ", vencedor)
           if(res.status === 'Empate!'){
            setStatus(res.status)
            if(res.p1.id === nome){
                setOponente(`/img/${res.p2.skin}/${res.p2.item}`)
                setInter(false)
            }else{
                setOponente(`/img/${res.p1.skin}/${res.p1.item}`)
                setInter(false)
            }
           }else if(res.status === 'Esperando oponente...'){
            setStatus(`${res.id} já fez sua jogada...`)
           }else{
            console.log("Dados rolaram!")
            if(vencedor === nome){
                setOponente(`/img/${res.p2.skin}/${res.p2.item}`)
                setStatus(`${res.status}`)
                setInter(false)
            }else{
                setOponente(`/img/${res.p1.skin}/${res.p1.item}`)
                setStatus(`${res.status}`)
                setInter(false)
            }
        }
        })

        socket.on("revice_msg", (res) =>{
            setChat(res)
        })
        
    }, [socket])


    return(
        <section className="jogo">
            <form onSubmit={(e) => entraSala(e)}>
                <input type="text" placeholder='Codigo da sala' defaultValue={''} required style={code ? {color: 'green'} : {color: 'black'}}/>
                <button className='btn'>Entrar</button>
            </form>
            <div className='placar'>
                <input onChange={(e) => setID(e.target.value)} required value={id} className='name-input' placeholder='Insira seu nickname' />
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
                        <div key={item.msg} className='msg'>
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