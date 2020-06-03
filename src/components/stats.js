import AbstractSmartComponent from "./abstract-smart-component";
import {MEANS_OF_TRANSPORT} from "../const.js";

import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

const BAR_HEIGHT = 55;

const Title = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPEND: `TIME SPEND`
};

const TypeToLabel = {
  "taxi": `🚕 TAXI`,
  "bus": `🚌 BUS`,
  "train": `🚂 TRAIN`,
  "ship": `🛳 SHIP`,
  "transport": `🚆 RIDE`,
  "drive": `🚗 DRIVE`,
  "flight": `✈️ FLY`,
  "check-in": `🏨 STAY`,
  "sightseeing": `🏛 SEE`,
  "restaurant": `🍴 EAT`
};

const isUniqueItem = (item, index, items) => {
  return items.indexOf(item) === index;
};

const getAllEventTypes = (points) => {
  return points
    .map((point) => point.type)
    .filter(isUniqueItem);
};

const getEventsByType = (points, type) => {
  return points.filter((point) => point.type === type);
};

const getTypeTotalCost = (points, type) => {
  const typePoints = getEventsByType(points, type);
  return typePoints.reduce((acc, point) => {
    acc += point.price;
    return acc;
  }, 0);
};

const getEventDuration = (point) => {
  const dateFrom = moment(point.dateFrom);
  const dateTo = moment(point.dateTo);
  return dateTo.diff(dateFrom, `minutes`);
};

const getTotalTime = (points, type) => {
  const typePoints = getEventsByType(points, type);
  const totalDuration = typePoints.reduce((acc, point) => {
    acc += getEventDuration(point);
    return acc;
  }, 0);
  return Math.round(moment.duration(totalDuration, `minutes`).asHours());
};

const getAmountByType = (points, type) => getEventsByType(points, type).length;

const getCostsByTypes = (points) => {
  const types = getAllEventTypes(points);
  return types.map((type) => {
    return {
      type,
      value: getTypeTotalCost(points, type)
    };
  })
  .sort((left, right) => right.value - left.value);
};


const getTransportUsingAmount = (points) => {
  const types = MEANS_OF_TRANSPORT.filter(
      (type) => points.findIndex((point) => point.type === type) !== -1
  );

  return types.map((type) => {
    return {
      type,
      value: getAmountByType(points, type)
    };
  })
  .sort((left, right) => right.value - left.value);
};

const getTimeByTypes = (points) => {
  const types = getAllEventTypes(points);
  return types.map((type) => {
    return {
      type,
      value: getTotalTime(points, type)
    };
  })
  .filter((type) => type.value !== 0)
  .sort((left, right) => right.value - left.value);
};

const getLabels = (types) => types.map((item) => TypeToLabel[item.type]);

const getValues = (types) => types.map((item) => item.value);

const renderChart = (ctx, options) => {
  const {labels, values, title, formatter} = options;
  const amount = values.length;
  // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
  ctx.height = BAR_HEIGHT * amount;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter,
        }
      },
      title: {
        display: true,
        text: title,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

    this._charts = [];
    this._renderCharts();
  }

  getTemplate() {
    return (
      `<section class="statistics">
        <h2 class="visually-hidden">Trip statistics</h2>

        <div class="statistics__item statistics__item--money">
          <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--transport">
          <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
        </div>

        <div class="statistics__item statistics__item--time-spend">
          <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
        </div>
      </section>`
    );
  }

  recoveryListeners() {}

  rerender() {
    this._resetCharts();
    super.rerender();
    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    const points = this._pointsModel.getPoints();
    const typesCosts = getCostsByTypes(points);
    const transportUsing = getTransportUsingAmount(points);
    const timeSpend = getTimeByTypes(points);

    const moneyChart = renderChart(moneyCtx, {
      labels: getLabels(typesCosts),
      values: getValues(typesCosts),
      title: Title.MONEY,
      formatter: (val) => `€ ${val}`
    });

    const transportChart = renderChart(transportCtx, {
      labels: getLabels(transportUsing),
      values: getValues(transportUsing),
      title: Title.TRANSPORT,
      formatter: (val) => `${val}x`
    });

    const timeChart = renderChart(timeSpendCtx, {
      labels: getLabels(timeSpend),
      values: getValues(timeSpend),
      title: Title.TIME_SPEND,
      formatter: (val) => `${val}H`
    });

    this._charts.push(moneyChart, transportChart, timeChart);
  }

  _resetCharts() {
    if (this._charts.length) {
      this._charts.forEach((chart) => {
        chart.destroy();
      });
      this._charts = [];
    }
  }
}
