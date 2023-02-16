import './Buttons.css'

const Buttons = ( {skin, jogada, desativa}) =>{
    const skins = skin
    //sistema de bot

/*
    const envia = (e) =>{
        var res = e.target.src.split('/img/')
        const final_res =  "/img/" + res[1]
        props.player_choice(final_res)
        
        const botChocie = Math.floor(Math.random() * 3)
        var bot = ''

        if(botChocie === 0){
            bot = skins.papel
            props.bot_choice(bot)
        }else if(botChocie === 1){
            bot = skins.tesoura
            props.bot_choice(bot)
        }else{
            bot = skins.pedra
            props.bot_choice(bot)
        }
        props.resultados(verificaVencedor(final_res, bot))
    }
*/
    return (
        <div className="button-list">
            <button disabled={desativa} onClick={ () => jogada(skins.papel)}><img src={skins.papel} alt="Papel" /></button>
            <button disabled={desativa} onClick={ () => jogada(skins.tesoura)}><img src={skins.tesoura} alt="Tesoura" /></button>
            <button disabled={desativa} onClick={ () => jogada(skins.pedra)}><img src={skins.pedra} alt="Pedra" /></button>
        </div>
       

    )
}


export default Buttons