<template>
    <div id="cpf-form">
        <div class="form-group" :class="{error:invalidFeedback != ''}">
            <label>Olá, queremos te ver #NOVERDE, para isso precisamos do seu CPF.</label>
            <input type="text" v-model="cpf" ref="cpfInput" placeholder="Informe o seu CPF" 
                    @keydown="monitorarKeyDown" @keyup="monitorarKeyUp" maxlength="11" />
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
            cpf: "", // Guarda o que o usuário digita no input 'cpf'
            invalidFeedback: '' // Mensagem de feedback caso os dados informados sejam inválidos
        }
    },
    methods: {
        validarForm() {
            if (this.cpf != '') {
                var resultado = this.validarCPF();
                if (!resultado) { 
                    this.invalidFeedback = "CPF inválido, verifique o número informado." 
                }
                return resultado;
            } else {
                // Este feedback só serve caso o evento 'cpf-removido' 
                // não seja utilizado para bloquear o botão próximo
                this.invalidFeedback = 'Para prosseguir, informe seu CPF.';
                return false;
            }
        },
        // Monitora o pressionar de teclas do input e dispara um evento
        monitorarKeyDown(event) {
            if (event.keyCode == 13) {
                // Dispara evento ao pressionar ENTER
                eventHub.$emit('enter-pressionado');
            }
        },
        // Monitora o soltar de teclas do input e dispara alguns eventos e funções
        monitorarKeyUp(event) {
            this.formatarCPF();

            if (this.invalidFeedback != '') {
                // Reseta a mensagem de feedback
                this.invalidFeedback = ''; 
            }
            
            if (this.cpf.length == 11) {
                // Ao inserir o CPF com 11 caracteres dispara esse evento
                // O 'App' escuta o evento e manda o componente 'Wizard' liberar o botão próximo
                eventHub.$emit('cpf-inserido');
            } else {
                // Caso o CPF inserido não tenha 11 caracteres, esse evento é disparado
                // O 'App' escuta o evento e manda o componente 'Wizard' bloquear o botão próximo
                eventHub.$emit('cpf-removido');
            }
        },
        formatarCPF() {
            // Formata CPF removendo caracteres indesejados
            // Dessa forma, o input mantém apenas números
            this.cpf = this.cpf.replace(/[\D\s\._\-]+/g, ""); 
        },
        validarCPF() {
            var cpf = this.cpf;
            var soma = 0;
            var resto;

            // Elimina CPFs inválidos conhecidos    
            if (cpf.length != 11 || 
                cpf == "00000000000" || 
                cpf == "11111111111" || 
                cpf == "22222222222" || 
                cpf == "33333333333" || 
                cpf == "44444444444" || 
                cpf == "55555555555" || 
                cpf == "66666666666" || 
                cpf == "77777777777" || 
                cpf == "88888888888" || 
                cpf == "99999999999") {
                return false;
            }

            // Valida primeiro dígito 
            for (var i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i); 
            }
            resto = 11 - (soma % 11);  
            if (resto == 10 || resto == 11) {
                resto = 0;
            }
            if (resto != parseInt(cpf.charAt(9))) {
                return false;       
            }    
                
            // Valida segundo dígito 
            soma = 0;    
            for (var i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i);  
            }
            resto = 11 - (soma % 11);  
            if (resto == 10 || resto == 11) {
                resto = 0;    
            }
            if (resto != parseInt(cpf.charAt(10))) {
                return false;       
            }

            return true;  
        }
    }
}
</script>

<style lang="scss">
</style>
