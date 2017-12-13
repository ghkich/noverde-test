<template>
    <div v-show="active" 
        :class="`wizard-tab ${layout} inner-box`"
        role="tabpanel"
        :id="`wizard-tab-${tabId}`"
        :aria-hidden="!active"
        :aria-labelledby="tabId">
        <slot :active="active">
        </slot>
    </div>
</template>
<script>
  export default {
    name: 'wizard-tab',
    props: {
      title: {
        type: String,
        default: ''
      },
      /*** 
       * LAYOUT
       * Sobreescreve o layout do pai -> wizard
       * Valores: boxed-xs, boxed-md, boxed-lg, full-width
       */
      layout: {
            type: String,
            default: '' 
      },
      /***
       * BEFORECHANGE 
       * Se definida, executa antes da troca de abas. 
       * O retorno da função deve ser Boolean.
       * Se o retorno for falso, a troca de abas não acontece.
       */
      beforeChange: {
        type: Function
      },
      /***
       * ONLOAD
       * Se definida, executa ao carregar a aba
       */
      onLoad: {
        type: Function
      }
    },
    inject: ['addTab'],
    data() {
      return {
        active: false,
        complete: false,
        tabId: ''
      }
    },
    mounted() {
      // Cada vez que este componente é utilizado adiciona uma aba à array 'Tabs' dentro do componente Wizard
      this.addTab(this)
    }
  }
</script>
