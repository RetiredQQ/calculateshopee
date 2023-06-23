var order = 0;
var total = 0;

async function calculate(next, count = 0) {
  const apiUrl = `https://shopee.com.my/api/v4/order/get_order_list?limit=5&list_type=3&offset=${next}`;
  const headers = {
    'Accept': 'application/json',
  };

  console.log(`Please wait... (${count} second)`);
  console.log('Calculating expenses...');

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: headers,
  });

  const body = await response.json();
  const next_offset = body.data.next_offset;

  if (next_offset >= 0) {
    for (const [key, value] of Object.entries(body.data.details_list)) {
      const total_temp = value.info_card.final_total / 100000;
      total += total_temp;
      order++;
      //console.log(order + ":", "RM " + total_temp + " - ", value.info_card.order_list_cards[0].items[0].name);
      // value.info_card.order_list_cards[0].items_groups
    }
    await calculate(next_offset, count + 1);
  } else {
    console.log('Calculation completed!');
    console.log('GRAND TOTAL: RM ' + Math.round(total * 100) / 100);
  }
}

const startTime = new Date().getTime() / 1000;
calculate(0, 0);

const intervalId = setInterval(() => {
  const currentTime = new Date().getTime() / 1000;
  const runningTime = Math.round(currentTime - startTime);
  console.log(`Please wait... (${runningTime} second)`);
}, 1000);

setTimeout(() => {
  clearInterval(intervalId);
}, 2000);
