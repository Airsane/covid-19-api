//===============================================Random functions
const Months = ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"];


//===============================================Chart

const { CanvasRenderService } = require('chartjs-node-canvas');


function Chart(width, height) {
    this.width = width,
        this.height = height,
        this.chartCallback = (ChartJS) => {
            ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
            ChartJS.plugins.register({
                beforeDraw: function (chartInstance) {
                    let ctx = chartInstance.chart.ctx;
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
                }
            });
            ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
            });
        },
        this.canvasRenderService = new CanvasRenderService(this.width, this.height, this.chartCallback),
        this.generateDates = (dayCount) => {
            let dateArr = [];
            let startDate = new Date("28 February 2020");
            for (let i = 0; i < dayCount; i++) {
                dateArr.push(startDate.getDate() + " " + Months[startDate.getMonth()])
                startDate.setDate(startDate.getDate() + 1);
            }
            return dateArr;
        },
        this.generateChart = async (infected, death, cured, dayCount) => {
            const configuration = {
                type: 'line',
                data: {
                    labels: this.generateDates(dayCount),
                    borderColor: "#fffff",
                    backgroundColor: '#fffff',
                    datasets: [{
                        label: 'Nakažený',
                        data: infected,
                        backgroundColor: 'red',
                        borderColor: 'red',
                        fill: false
                    }, {
                        label: 'Mrtvý',
                        data: death,
                        backgroundColor: 'purple',
                        borderColor: 'purple',
                        fill: false
                    }, {
                        label: 'Vyléčený',
                        data: cured,
                        backgroundColor: 'Green',
                        borderColor: 'Green',
                        fill: false
                    }
                    ]
                },
                options: {
                    responsive: true,
                    chartArea: {
                        backgroundColor: 'rgba(251, 85, 85, 0.4)'
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Den'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Počet'
                            }
                        }]
                    }
                }
            };
            return await this.canvasRenderService.renderToDataURL(configuration);
        }
}

module.exports.Chart = Chart;
module.exports.Months = Months;




