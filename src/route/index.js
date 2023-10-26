// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
	static #list = [];

	static #count = 0;

	constructor(img, title, description,category, price, amount = 0) {
		this.id = ++Product.#count,
		this.img = img,
		this.title = title,
		this.description = description,
		this.category = category,
		this.price = price,
		this.amount = amount
	}

	static add = (...data) => {
		const newProduct = new Product (...data);

		this.#list.push(newProduct)
	}

	static getList = () => {
		return this.#list
	}

	static getById = (id) => {
		return this.#list.find((product) => product.id === id)
	}

	static getRandomList = (id) => {
		// Фильтруемо товари
		const filteredList = this.#list.filter((product) => product.id !== id);

		const shuftledList = filteredList.sort(
			() => Math.random() - 0.5,
		)

		return shuftledList.slice(0, 3)
	}
};


Product.add(
	'https://picsum.photos/200/300',
	`Комп'ютер Artline Gaming AMD Ryzen 7 /`,
	`AMD Ryzen 5 3600 (3.7 - 4.5 ГГц) / RAM 16 ГБ / SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
	[
		{id: 1, text: 'Готовий до відправки'},
		{id: 2, text: 'Топ продажів'},
	],
	32000,
	5,
)

Product.add(
	'https://picsum.photos/200/300',
	`Комп'ютер Artline Gaming AMD Ryzen 9 /`,
	`AMD Ryzen 5 3600 (3.7 - 4.5 ГГц) / RAM 32 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
	[
		{id: 1, text: 'Готовий до відправки'},
		{id: 2, text: 'Топ продажів'},
	],
	41000,
	5,
)

Product.add(
	'https://picsum.photos/200/300',
	`Комп'ютер Artline Gaming AMD Ryzen 5 /`,
	`AMD Ryzen 5 3600 (3.7 - 4.5 ГГц) / RAM 16 ГБ / SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС`,
	[
		{id: 1, text: 'Готовий до відправки'},
		{id: 2, text: 'Топ продажів'},
	],
	23000,
	5,
)


class Purchase {
	static DELIVERY_PRIICE = 150;
	static #BONUS_FACTOR = 0.1;

	static #count = 0;
	static #list = [];

	static #bonusAccount = new Map();

	static getBonusBalance = (email) => {
		return Purchase.#bonusAccount.get(email) || 0
	}

	static calcBonusAmount = (value) => {
		return value * Purchase.#BONUS_FACTOR;
	}

	static updateBonusBalance = ( email, price, bonusUse = 0, ) => {
		const amount = this.calcBonusAmount(price);

		const currentBalance = Purchase.getBonusBalance(email)

		const updateBalance = currentBalance + amount - bonusUse;

		Purchase.#bonusAccount.set(email, updateBalance);

		return amount;
	}

	constructor(data, product) {
		this.id = ++Purchase.#count;

		this.firstname = data.firstname;
		this.lastname = data.lastname;
		
		this.phone = data.phone;
		this.email = data.email;

		this.comment = data.comment || null;

		this.bonus = data.bonus || 0;

		this.promocode = data.promocode || null;

		this.totalPrice = data.totalPrice;
		this.productPrice = data.productPrice;
		this.deliveryPrice = data.deliveryPrice;
		this.amount = data.amount;

		this.product = product;
		this.title = product.title;
	}

	static add = (...arg) => {
		const newPurchase = new Purchase(...arg);

		this.#list.push(newPurchase);
		return newPurchase;
	}

	static getList = () => {
		return Purchase.#list.reverse()
	}

	static getById = (id) => {
		return Purchase.#list.find((item) => item.id === id);
	}

	static updateByid = (id, data) => {
		const purchase = Purchase.getById(id);

		if (purchase) {
			if (data.firstname) purchase.firstname = data.firstname;
			if (data.lastname) purchase.lastname = data.lastname;
			if (data.phone) purchase.phone = data.phone;
			if (data.email) purchase.email = data.email;

			return true;
		} else {
			return false;
		}
	}
}


class Promocode {
	static #list = [];

	constructor(name, factor) {
		this.name = name,
		this.factor = factor
	}

	static add = (name, factor) => {
		const newPromocode = new Promocode(name, factor)
		Promocode.#list.push(newPromocode);
		return newPromocode;
	}

	static getByName = (name) => {
		return this.#list.find((promo) => promo.name === name)
	}

	static calc = (promo, price) => {
		return price * promo.factor
	}
}

Promocode.add('SUMMER2023', 0.9);
Promocode.add('DISCOUNT50', 0.5);
Promocode.add('SALE25', 0.75)

// ================================================================
// ================================================================


router.get('/', (req, res) => {

  res.render('purchase-index', {
		style: 'purchase-index',

		data: {
			list: Product.getList(),
		},
  });
});

// ================================================================
// ================================================================


// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/alert', function (req, res) {

  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
		data: {
			message: 'Успішне виконання дії!',
			info: 'Товар успішно був створенний',
			link: '/test-path',
		}
  });
})

// ================================================================
// ================================================================


router.get('/purchase-product', (req, res) => {
	const id = Number(req.query.id);

  res.render('purchase-product', {
		style: 'purchase-product',

		data: {
			list: Product.getRandomList(id),
			product: Product.getById(id),
		},
  });
});

// ================================================================
// ================================================================

router.post('/purchase-create', (req, res) => {
	const id = Number(req.query.id);
	const amount = Number(req.body.amount); 

	if (amount < 1) {
		return res.render('alert', {
			style: 'alert',
	
			data: {
				message: 'Помилка',
				info: 'Некоректна кількість товару',
				link: `/purchase-product?id=${id}`,
			},
		});
	}

	const product = Product.getById(id);

	if (product.amount < 1) {
		return res.render('alert', {
			style: 'alert',
	
			data: {
				message: 'Помилка',
				info: 'Такої кількість нема в наявності',
				link: `/purchase-product?id=${id}`,
			},
		});
	}

	console.log(product, amount);

	const productPrice = product.price * amount;
	const totalPrice = productPrice + Purchase.DELIVERY_PRIICE;
	const bonus = Purchase.calcBonusAmount(totalPrice)

	res.render('purchase-create', {
		style: 'purchase-create',

		data: {
			id: product.id,
			
			cart: [
				{
					text: `${product.title} (${amount})`,
					price: productPrice,
				},
				{
					text: 'Доставка',
					price: Purchase.DELIVERY_PRIICE,
				},
			],
			totalPrice,
			productPrice,
			deliveryPrice: Purchase.DELIVERY_PRIICE,
			amount,
			bonus
		}
	})
});

// ================================================================
// ================================================================

router.post('/purchase-submit', (req, res) => {
	const id = Number(req.query.id);
	
	let {
		totalPrice,
		productPrice,
		deliveryPrice,
		amount,
		
		firstname,
		lastname,
		email,
		phone,
		comment,
		
		promocode,
		bonus
	} = req.body;

	const product = Product.getById(id);
	

	if (!product) {
		return res.render('alert', {
			style: 'alert',

			data: {
				message: 'Помилка',
				info: 'Товар не знайдено',
				link: '/purchase-list',
			},
		})
	}

	if (product.amount < amount) {
		return res.render('alert', {
			style: 'alert',

			data: {
				message: 'Помилка',
				info: 'Товару нема в потріній кількості',
				link: `/purchase-list`,
			},
		})
	}

	// Конвертируемо в число
	totalPrice = Number(totalPrice);
	productPrice = Number(productPrice);
	deliveryPrice = Number(deliveryPrice);
	amount = Number(amount);
	bonus = Number(bonus)

	if (
		isNaN(totalPrice) ||
		isNaN(productPrice) ||
		isNaN(deliveryPrice) ||
		isNaN(amount) ||
		isNaN(bonus)
	) {
		return res.render('alert' , {
			style: 'alert',
			data: {
				message: 'Помилка',
				info: 'Некоректні дані',
				link: '/purchase-list',
			}
		})
	}
	

	if (!firstname || !lastname || !email || !phone) {
		return res.render('alert' , {
			style: 'alert', 

			data: {
				message: 'Заповніть обовязкові поля!',
				info: 'Некоректні дані',
				link: `/purchase-product?id=${id}`,
			}
		})
	}

	if (bonus || bonus > 0) {
		const bonusAmount = Purchase.getBonusBalance(email);

		console.log(bonusAmount);

		if (bonus > bonusAmount) {
			bonus = bonusAmount;
		}

		Purchase.updateBonusBalance(email, totalPrice, bonus)

		totalPrice -= bonus;
	} else {
		Purchase.updateBonusBalance(email, totalPrice, 0)
	}

	if (promocode) {
		promocode = Promocode.getByName(promocode)

		if (promocode) {
			totalPrice = Promocode.calc(promocode, totalPrice)
		}
	}

	if (totalPrice < 0) totalPrice = 0;

	const purchase = Purchase.add(
		{
			totalPrice,
			productPrice,
			deliveryPrice,
			amount,
			bonus,

			firstname,
			lastname,
			email,
			phone,

			promocode,
			comment
		},
		product,
	)

  res.render('alert', {
		style: 'alert',
		id: id,
		data: {
			message: 'Успишно',
			info: 'Замовлення створено',
			link: `/purchase-list`,
		},
		purchase
  });
});

// ================================================================
// ================================================================

router.get('/purchase-list', (req, res) => {
	const id = Number(req.query.id);
	const list = Purchase.getList().map(item => {
		const {id, title, totalPrice, bonus} = item;
		return {id, title, totalPrice, bonus};
	})

	console.log(list);
  res.render('purchase-list', {
		style: 'purchase-list',

		data: {
			list: list,
		},
  });
});

// ================================================================

router.get('/info-order', (req, res) => {
	const id = Number(req.query.id);

  res.render('info-order', {
		style: 'info-order',

		data: {
			list: Purchase.getById(id),
		},
  });
});


// ================================================================

router.post('/edit-data', (req, res) => {
	const id = Number(req.query.id);

  res.render('edit-data', {
		style: 'edit-data',
		data: {
			list: Purchase.getById(id)
		},
  });
	
});
// ================================================================
router.get('/edit-data', (req, res) => {
  const id = Number(req.query.id);
  res.render('edit-data', {
    style: 'edit-data',
    data: {
      list: Purchase.getById(id)
    },
  });
});
// ================================================================
router.post('/update-data', (req, res) => {
	const id = Number(req.query.id);
	
	const data = { firstname, lastname, email, phone } = req.body;
	console.log("!!!!!!!!!! data", data);

	if (!data || !data.firstname || !data.lastname || !data.email || !data.phone) {
		return res.render('alert', {
			style: 'alert',

			data: {
				message: 'Помилка',
				info: 'Заповніть основні поля',
				link: `/edit-data?id=${id}`,
			},
		})	
  }

	Purchase.updateByid(id, data);

	res.render('alert', {
		style: 'alert',
		id: id,
		data: {
			message: 'Успішно',
			info: 'Дані оновленні',
			link: `/`,
		},
	});

});
// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router