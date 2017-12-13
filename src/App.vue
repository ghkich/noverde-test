<template>
    <div id="app" :class="`status-${status}`">
        <wizard ref="wizard" size="sm">
            <wizard-tab title="CPF" :before-change="validarFormCPF" :on-load="focusOnCpfInput">
                <form-cpf ref="formCpf"></form-cpf>
            </wizard-tab>
            <wizard-tab title="Crédito" :before-change="validarFormCredito" :on-load="focusOnCreditoInput">
                <form-credito ref="formCredito"></form-credito>
            </wizard-tab>
            <wizard-tab title="Resultado" layout="boxed-lg" :on-load="carregarResultado">
                <resultado ref="resultado"></resultado>
            </wizard-tab>
        </wizard>
    </div>
</template>
    
<script>    
import Wizard from './components/Wizard';
import WizardTab from './components/WizardTab';
import FormCPF from './components/FormCPF';
import FormCredito from './components/FormCredito';
import Resultado from './components/Resultado';

// Instância vue para gerenciar eventos entre componentes
import { eventHub } from "./main";

export default {
    components: {
        'wizard': Wizard,
        'wizard-tab': WizardTab,
        'form-cpf': FormCPF,
        'form-credito': FormCredito,
        'resultado': Resultado
    },
    data() {
        return {
            status: '' // Usado para mudança de cores do 'Wizard' (approved e denied)
        }
    },
    methods: {
        validarFormCPF() {
            return this.$refs.formCpf.validarForm();
        },
        validarFormCredito() {
            return this.$refs.formCredito.validarForm();
        },
        carregarResultado() {
            var amount = this.$refs.formCredito.credito;
            var cpf = this.$refs.formCpf.cpf;
            
            this.$refs.wizard.isLoading = true; // Mostrar loading
            this.$refs.resultado.simularEmprestimo(amount, cpf);
        },
        focusOnCpfInput() {
            var vm = this;
            // Preciso usar o setTimeout devido a div que contém o elemento não estar visível logo no início
            setTimeout(function() {
                vm.$refs.formCpf.$refs.cpfInput.focus();
            }, 0);
        },
        focusOnCreditoInput() {
            var vm = this;
            // Preciso usar o setTimeout devido a div que contém o elemento não estar visível logo no início
            setTimeout(function() {
                vm.$refs.formCredito.$refs.creditoInput.focus();
            }, 0);
        }
    },
    mounted() {
        var wizard = this.$refs.wizard;
        eventHub.$on('cpf-inserido', () => {
            // Libera o botão próximo da aba do CPF
            wizard.isTabReady = true; 
        });
        eventHub.$on('cpf-removido', () => {
            // Bloqueia o botão próximo da aba do CPF
            wizard.isTabReady = false; 
        });
        eventHub.$on('credito-inserido', () => {
            // Libera o botão próximo da aba do Crédito
            wizard.isTabReady = true; 
        });
        eventHub.$on('credito-removido', () => {
            // Bloqueia o botão próximo da aba do Crédito
            wizard.isTabReady = false; 
        });
        eventHub.$on('enter-pressionado', () => {
            // Ir para a próxima aba caso o botão próximo esteja ativo
            if (wizard.isTabReady) {
                wizard.nextTab(); 
            }
        });
        eventHub.$on('resultado-pronto', (status) => {
            wizard.isLoading = false; // Esconder loading
            this.status = status; // Define o status do app - usado para mudança de cores
        });
    }
}
</script>

<style lang="scss">
    @import "./assets/scss/main";
</style>
