<template>
    <div id="resultado" class="text-center">
        <template v-if="foiAprovado != null">
            <h1>{{ (foiAprovado) ? mensagemAprovado : mensagemNegado }}</h1>
            <h4 v-if="creditoLiberadoMenor">*O valor que liberamos é menor do que o escolhido</h4>
            <div class="spots" v-if="foiAprovado">
                <div class="spot">
                    <h2>Limite liberado</h2>
                    <h1><sup>R$</sup>{{ creditoLiberadoFormatado }}</h1>
                </div>
                <div class="spot">
                    <h2>Parcelas para pagar</h2>
                    <h1>{{ parcelas }}x {{ valorParcelaFormatado }}</h1>
                </div>
                <div class="spot">
                    <h2>Primeiro vencimento</h2>
                    <h1>{{ primeiroVencimentoFormatado }}</h1>
                </div>
            </div>
        </template>
    </div>
</template>
    
<script>
// Instância vue para gerenciar eventos entre componentes
import { eventHub } from "../main";

export default {
    data() {
        return {
            foiAprovado: null,
            creditoLiberadoMenor: false,
            mensagemAprovado: 'Uhull, você foi aprovado!',
            mensagemNegado: 'Não conseguimos aprovar o seu empréstimo :(',
            creditoLiberado: 2000.00,
            parcelas: 12,
            valorParcela: 200.30,
            primeiroVencimento: '2018-10-20'
        }
    },
    computed: {
        primeiroVencimentoFormatado() {
            var data = this.primeiroVencimento;
            var dataSplitada = data.split('-');

            var ano = dataSplitada[0];
            var mes = dataSplitada[1];
            var dia = dataSplitada[2];

            if (parseInt(mes) <= 9) {
                mes = '0' + mes;
            }
            if (parseInt(dia) <= 9) {
                dia = '0' + dia;
            }

            return dia + '/' + mes + '/' + ano;
        },
        valorParcelaFormatado() {
            return this.formatarParaReal(this.valorParcela);
        },
        creditoLiberadoFormatado() {
            return this.formatarParaReal(this.creditoLiberado);
        }
    },
    methods: {
        simularEmprestimo(amount, cpf) {
            amount = this.formatarParaDecimal(amount);
            var creditoEscolhido = amount;
            var postData = { "amount": amount, "cpf": cpf };
            this.$http.post('https://api.noverde-hmg.net/fakes', postData, { 
                headers: {
                    'Authorization': 'Bearer NOVERDEFAKETOKEN'
                }
            }).then(function(response) {
                var data = response.body;
                if (data.status == 'approved') {
                    this.creditoLiberado = data.amount;
                    this.parcelas = data.period;
                    this.valorParcela = data.installment;
                    this.primeiroVencimento = data.first_due_date;

                    if (this.creditoLiberado < creditoEscolhido) {
                        creditoLiberadoMenor = true;
                    }

                    this.foiAprovado = true;
                }
                else {
                    this.foiAprovado = false;
                }
                // Evento utilizado para mudar as cores de acordo com o status (approved e denied)
                eventHub.$emit('resultado-pronto', data.status);
            });
        },
        formatarParaDecimal(valorString) {
            return parseInt(valorString.split('.').join(""));
        },
        formatarParaReal(valorDecimal) {
            var valorString = String(valorDecimal).replace('.', ',');
            var stringSplitada = valorString.split(',');
            var valorFormatado;
            if (stringSplitada.length > 1 && stringSplitada[1].length < 2)
            {
                valorFormatado = stringSplitada[0] + ',' + stringSplitada[1] + '0';
            } else {
                valorFormatado = stringSplitada[0] + ',00';
            }
            return valorFormatado;
        }
    },
}
</script>

<style lang="scss">
</style>
