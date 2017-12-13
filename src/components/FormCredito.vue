<template>
    <div id="credito-form">
        <div class="form-group" :class="{error:invalidFeedback != ''}">
            <label>De quanto você precisa pra ficar #NOVERDE?</label>
            <div class="input-group">
                <span class="input-group-addon">R$</span>
                <input type="text" v-model="credito" ref="creditoInput" 
                        @keydown="monitorarKeyDown" @keyup="monitorarKeyUp" maxlength="15"/>
            </div>
            <div class="invalid-feedback" v-if="invalidFeedback != ''">{{ invalidFeedback }}</div>
        </div>
    </div>
</template>
    
<script>
// Instância vue para gerenciar eventos entre componentes
import { eventHub } from "../main";

export default {
    data() {
        return {
            credito: "", // Guarda o que o usuário digita no input 'credito'
            invalidFeedback: '' // Mensagem de feedback caso os dados informados sejam inválidos
        }
    },
    methods: {
        validarForm() {
            if (this.credito !== '') {
                return true;
            } else {
                // Este feedback só serve caso o evento 'credito-removido' 
                // não seja utilizado para bloquear o botão próximo
                this.invalidFeedback = 'Para prosseguir, informe um valor.';
                return false;
            }
        },
        monitorarKeyDown(event) {
            if (event.keyCode == 13) {
                // Dispara evento ao pressionar ENTER
                eventHub.$emit('enter-pressionado');
            }
        },
        monitorarKeyUp(event) {
            this.formatarCredito();

            if (this.invalidFeedback != '') {
                // Reseta a mensagem de feedback
                this.invalidFeedback = ''; 
            }

            if (this.credito != '') {
                // Qualquer valor inserido dispara este evento 
                // O 'App' escuta o evento e manda o componente 'Wizard' liberar o botão próximo
                eventHub.$emit('credito-inserido');
            } else {
                // Caso o valor inserido seja removido, esse evento é disparado
                // O 'App' escuta o evento e manda o componente 'Wizard' bloquear o botão próximo
                eventHub.$emit('credito-removido');
            }
        },
        formatarCredito() {
             // Remove caracteres indesejados como letras e espaços
            this.credito = this.credito.replace(/[\D\s\._\-]+/g, "");
            // Transforma a string this.credito em int
            this.credito = this.credito ? parseInt( this.credito, 10 ) : 0;
            // Coloca o separador de milhares baseado na localização informada
            this.credito = ( this.credito === 0 ) ? "" : this.credito.toLocaleString( "pt-BR");
        }
    }
}
</script>

<style lang="scss">
</style>
