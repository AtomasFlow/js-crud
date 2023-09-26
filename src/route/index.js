// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
	static #list = [];

	constructor (name, price, description) {
		this.id = this.generateRandomId();
		this.createDate = new Date().toISOString();
		this.name = name;
		this.price = price;
		this.description = description;
	}

	generateRandomId() {
		const number = 100000;
		return Math.floor(Math.random() * number);
	}

	static getList = () => this.#list;

	static add = (product) => {
		this.#list.push(product);
	}

	static getById = (id) => this.#list.find((product) => product.id === id);

	static updateById = (id, data) => {
		const product = this.getById(id);
		
		if (product) {
			this.update(product, data);
			return true;
		} else {
			return false;
		}
	}

	static update = (product, {name, price, description}) => {
		if (name) {
			product.name = name;
		}

		if (price) {
			product.price = price;
		}

		if (description) {
			product.description = description;
		}
	}

	static deleteById = (id) => {
		const index = this.#list.findIndex((product) => product.id === id);

		if (index !== -1) {
			this.#list.splice(index, 1);
			return true;
		} else {
			return false;
		}
	}
}

// ================================================================

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
	const list = Product.getList();

  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
		data: {
			list,
		}
  });
})

// ================================================================

router.post('/product-create', (req, res) => {
  const { name, price, description } = req.body;

	if (!name || !price || !description) {
		return res.render('alert', {
			style: 'alert',

			messageTitle: 'Ошибка!',
			message: 'Пожалуйста, заполните все поля для создания товара',
			backUrl: '/',
		})
	}

  const product = new Product(name, price, description);
  Product.add(product);

  res.render('alert', {
		style: 'alert',

		messageTitle: 'Успішне виконання дії!',
    message: 'Товар успішно був створенний',
    backUrl: '/product-list',
  });
});


// ================================================================

router.get('/product-list', function (req, res) {
	const list = Product.getList();

  res.render('product-list', {
		style: 'product-list',

		data: {
			products: list,
		},
  });
})

// ================================================================
router.get('/product-edit', function (req, res) {
	const {id} = req.query;
	const product = Product.getById(Number(id));

	if (!product) {
		return res.render('alert', {
			style: 'alert',

			messageTitle: 'Ошибка!',
			message: `Товар з таким ID: ${id} не знайдено`,
		});
	}

  res.render('product-edit', {
		style: 'product-edit',
		data: {
			product,
		},
  });
	
});
// ================================================================

router.post('/product-edit', function (req, res) {
	const {name, price, description, id} = req.body;

	const product = Product.getById(Number(id));

	if (!product) {
		return res.render('alert', {
			style: 'alert',

			messageTitle: 'Ошибка!',
			message: `Товар з таким ID: ${id} не знайдено`,
		});
	}

	if (name) {
		product.name = name;
	}

	if (price) {
		product.price = price;
	}

	if (description) {
		product.description = description;
	}

  res.render('alert', {
		style: 'alert',
		
		messageTitle: 'Успішне виконання дії!',
		message: 'Товар оновлен',

		backUrl: 'product-list',
  });
	
});

// ================================================================

router.get('/product-delete', (req, res) => {
	const {id} = req.query;

	const productToDelete  = Product.getById(Number(id))

	if (!productToDelete ) {
		return res.render('alert', {
			style: 'alert',

			messageTitle: 'Ошибка!',
			message: `Товар з таким ID: ${id} не знайдено і не був видалений`,
			// backUrl: 'product-list',
		});
	};

	Product.deleteById(productToDelete);
	
  res.render('alert', {
		style: 'alert',

		messageTitle: 'Успішне виконання дії!',
    message: 'Товар успішно був видаленний',
		// backUrl: 'product-list',
  });
});

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
