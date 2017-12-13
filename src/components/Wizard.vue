<template>
    <div :class="`wizard wizard-${layout} wizard-${position}`">
        <header class="wizard-header">
            <ul class="wizard-steps inner-box" role="tablist">
                <li :id="tab.tabId"
                    class="wizard-step" 
                    :class="{active:tab.active, complete:tab.complete}" 
                    role="tab" 
                    v-for="(tab, index) in tabs">
                    <span class="step-number">Passo {{index+1}}</span>
                    {{ tab.title }}
                </li>
            </ul>
        </header>
        <div class="wizard-body" :class="{loading:isLoading}" >
            <div class="wizard-tabs">
                <slot></slot>
            </div>
            <div class="wizard-controls inner-box" v-if="activeTabIndex < tabs.length - 1">
                <a class="btn btn-primary" @click="nextTab" :class="{disabled:!this.isTabReady}">
                    <span>Próximo</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'wizard',
    props: {
        /***
         * LAYOUT
         * Controla o layout do wizard
         * Valores: 
         *     boxed-xs - terá todo o conteúdo comprimido no inner-box com width máximo de 450px
         *     boxed-md - terá todo o conteúdo comprimido no inner-box com width máximo de 650px
         *     boxed-lg - terá todo o conteúdo comprimido no inner-box com width máximo de 850px
         *     full-width - o conteúdo do wizard utilizará todo o espaço horizontal
         */
        layout: {
            type: String,
            default: 'boxed-xs' 
        },
        /***
         * POSITION
         * Controla o comportamento visual de posicionamento do wizard
         * Valores: 
         *     static - a div principal terá position static
         *     fixed - a div principal terá position fixed e cobrirá todo o body
         */
        position: {
            type: String,
            default: 'fixed'
        }
    },
    provide() {
      return {
        addTab: this.addTab,
      }
    },
    data() {
        return {
            activeTabIndex: 0, // atual aba ativa
            isTabReady: false, // serve para ativar e desativar o botão próximo
            isLoading: false, // serve para dar feedback ao usuário caso a aba esteja esperando algum resultado
            tabs: [] // array na qual os componentes "WizardTab" são adicionados
        }
    },
    methods: {
        // Adiciona abas dinamicamente conforme o número de componentes 'WizardTab' dentro do 'Wizard'
        addTab(wizardTab) {
            const index = this.$slots.default.indexOf(wizardTab.$vnode);
            wizardTab.tabId = `${wizardTab.title.replace(/ /g, '')}${index}`;
            this.tabs.splice(index, 0, wizardTab);
        },
        // Vai para próxima aba ao clicar no botão Próximo
        nextTab() {
            var currentIndex = this.activeTabIndex;
            var currentTab = this.tabs[currentIndex]
            var nextIndex = this.activeTabIndex + 1;
            var nextTab = this.tabs[nextIndex]

            // Callback executada após verificação que se encontra logo abaixo desta
            var nextTabCB = () => {
                // Só executa se houver próxima aba
                if (currentIndex < this.tabs.length - 1) {
                    if (currentTab) {
                        currentTab.active = false;
                        currentTab.complete = true;
                    }
                    if (nextTab) {
                        nextTab.active = true;
                        this.executeOnLoad(nextTab);
                    }
                    this.activeTabIndex = nextIndex;
                    return true;
                }
            }
            // Verifica se a função beforeChange foi definida para a aba atual
            // Se sim, executa a função definida antes de mudar para a nova aba
            if (currentTab && currentTab.beforeChange !== undefined) {
                this.executeBeforeChange(currentTab.beforeChange(), nextTabCB)
            }
        },
        // Executa antes de mudar de aba caso a função 'beforeChange' na 'WizardTab' seja definida
        executeBeforeChange(beforeChangeResult, callback) {
            // Só muda de aba se a função 'beforeChange' retornar 'true'
            if (beforeChangeResult) {
                this.isTabReady = false;
                callback();
            } 
        },
        // Executa ao carregar a aba caso a função 'onLoad' na 'WizardTab' seja definida
        executeOnLoad(tab) {
            if (tab && tab.onLoad !== undefined) {
                tab.onLoad();
            }
        },
        // Se existir abas adicionadas ao Wizard, ativa a primeira delas
        initializeTabs() {
            if (this.tabs.length > 0) {
                var tab = this.tabs[this.activeTabIndex];
                if (tab) {
                    tab.active = true;
                    this.executeOnLoad(tab);
                }
            }
        }
    },
    mounted () {
      this.initializeTabs()
    },
}
</script>

<style lang="scss">
    @import "../assets/scss/wizard";
</style>
