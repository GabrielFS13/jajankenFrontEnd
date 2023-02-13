import Buttons from '../Buttons'
import './Jogos.css'
import React, { useState, useEffect } from 'react';
const { io } = require("socket.io-client");
const link = process.env.REACT_APP_URL_SOCKET

const socket = io(link);

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

    socket.on("connect", () => {
       console.log("Novo Jogador Conectado")
    });

    function enviaJogada(jogada){
        setEscolha(jogada)
        const item = jogada.split('/')
        socket.emit('jogada', {
            skin: item[2],
            item: item[3],
            id: id
         })
        }

    useEffect( () =>{  

        socket.on("jogadas", (res) =>{
           setStatus(res.status)
           if(res.p1.id !== id){
            setOponente("/img/desenho/"+res.p1.item)
            }else{
            setOponente("/img/desenho/"+res.p2.item)
            }
        })


        socket.on('logado', (res) =>{
            console.log(res)
            setOponenteID(res.player)
        })
        
    }, [socket])


    

    const [id, setID] = useState('Guest'+Math.floor(Math.random()*300))
    const [oponenteID, setOponenteID] = useState('')
    const [escolha, setEscolha] = useState('')
    const [opoente, setOponente] = useState('')
    const [status, setStatus] = useState('')

    useEffect( () =>{

        socket.emit("jogadores", {
            player: id
       })
    }, [oponenteID])

    return(
        <section className="jogo">
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
        </section>
    )
}


export default Jogos