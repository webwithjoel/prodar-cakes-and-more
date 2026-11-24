export const cakeConfig = {
  basePrices: {
    '6': { 1: 12000, 2: 20000, 3: 28000 },
    '8': { 1: 18000, 2: 30000, 3: 42000 },
    '10': { 1: 26000, 2: 42000, 3: 58000 },
    '12': { 1: 36000, 2: 58000, 3: 80000 },
  },
  flavours: [
    { label: 'Vanilla (plain)', surcharge: 0 },
    { label: 'Chocolate', surcharge: 0 },
    { label: 'Red velvet', surcharge: 2000 },
    { label: 'Coconut', surcharge: 2000 },
  ],
  finishes: [
    { label: 'Buttercream', type: 'none' },
    { label: 'Fondant', type: 'percent', value: 25 },
  ],
  addons: [
    { id: 'printed-topper', label: 'Printed character/theme topper', price: 3000, max: 1 },
    { id: 'birthday-topper', label: 'Happy Birthday acrylic or paper topper', price: 1500, max: 1 },
    { id: 'name-plaque', label: 'Name/message plaque', price: 1500, max: 1 },
    { id: 'drip-effect', label: 'Drip effect', price: 3000, max: 1 },
    { id: 'artificial-flowers', label: 'Artificial flowers', price: 4000, max: 1 },
    { id: 'gold-spheres', label: 'Gold or colour spheres', price: 2500, max: 1 },
    { id: 'edible-image', label: 'Edible image on cake', price: 4000, max: 1 },
    { id: 'cupcake-box', label: 'Box of 6 cupcakes', price: 4000, max: 4 },
  ],
}

export const weddingConfig = {
  tiers: [
    { label: '2-tier · 6″ + 8″', price: 95000 },
    { label: '2-tier · 8″ + 10″', price: 130000 },
    { label: '3-tier · 6″ + 8″ + 10″', price: 190000 },
  ],
  flavoursPerTier: [
    { label: 'Vanilla', surcharge: 0 },
    { label: 'Chocolate', surcharge: 0 },
    { label: 'Red velvet', surcharge: 3000 },
  ],
  addons: [
    { id: 'mr-mrs-topper', label: 'Mr & Mrs topper', price: 5000, max: 1 },
    { id: 'wedding-flowers', label: 'Sugar/artificial flowers', price: 12000, max: 1 },
    { id: 'wedding-spheres', label: 'Gold spheres', price: 5000, max: 1 },
    { id: 'textured-fondant', label: 'Textured fondant finish', price: 10000, max: 1 },
    { id: 'cutting-cake', label: 'Extra cutting cake (8″ single layer)', price: 18000, max: 1 },
  ],
  noticeHours: 72,
}

export const prices = {
  bulkRules: {
    standard: [{ min: 10, pct: 5 }, { min: 30, pct: 10 }],
    cupcakes: [{ min: 24, pct: 5 }, { min: 50, pct: 10 }],
    parfait: [{ min: 10, pct: 5 }, { min: 25, pct: 10 }],
    smallBatch: [{ min: 24, pct: 5 }, { min: 50, pct: 10 }],
  },
  chinchin: {
    variants: [
      { label: 'Small cup', price: 1500, image: '/images/review-chinchin-jars.jpg' },
      { label: 'Medium jar', price: 4000, image: '/images/review-chinchin-jars.jpg' },
      { label: 'Large jar', price: 7500, image: '/images/review-chinchin-jars.jpg' },
      { label: 'Extra-large tub', price: 15000, image: '/images/chinchin-large-tub.jpg' },
    ],
    giftPack: 1000,
    eventLabel: 150,
  },
  peanutBurger: {
    variants: [
      { label: 'Small pack', price: 1500 },
      { label: 'Jar', price: 4000 },
      { label: 'Large jar', price: 7500 },
    ],
  },
  cupcakes: {
    unitPrice: 700,
    quantityPresets: [6, 12, 24, 50],
    flavours: [{ label: 'Vanilla', surcharge: 0 }, { label: 'Chocolate', surcharge: 50 }],
    themedCases: 50,
  },
  meatPie: { unitPrice: 1000, quantityPresets: [6, 12, 24, 50] },
  miniLoaves: {
    unitPrice: 1500,
    quantityPresets: [4, 8, 12],
    toppings: ['Chocolate chip', 'Oreo', 'Coconut flakes', 'Mixed nuts', 'Plain'],
  },
  smallChops: {
    sizes: [
      { label: 'Mini box (about 4 people)', price: 6000, image: '/images/small-chops-mini-boxes.jpg' },
      { label: 'Classic tray (about 10)', price: 12000, image: '/images/small-chops-tray.jpg' },
      { label: 'Party tray (about 20)', price: 22000, image: '/images/small-chops-tray.jpg' },
      { label: 'Mega tray (about 40)', price: 40000, image: '/images/small-chops-tray.jpg' },
    ],
    choices: ['Spring rolls', 'Samosa', 'Puff-puff', 'Fried chicken pieces', 'Peanut burger'],
    pepperSauce: 1000,
    maxPepperSauce: 4,
  },
  parfait: {
    variants: [{ label: 'Regular cup', price: 3000 }, { label: 'Large cup', price: 4500 }],
    layers: ['Classic', 'Strawberry'],
    toppings: 500,
  },
  surprisePackages: {
    tiers: [{ label: 'Mini', price: 18000 }, { label: 'Classic', price: 35000 }, { label: 'Premium', price: 65000 }],
    addons: [
      { id: 'balloon-bouquet', label: 'Balloon bouquet', price: 5000, max: 2 },
      { id: 'flowers', label: 'Flowers', price: 8000, max: 2 },
      { id: 'chocolate-box', label: 'Chocolate box', price: 6000, max: 2 },
      { id: 'note-card', label: 'Personalised note card', price: 1000, max: 1 },
      { id: 'gift-wrap', label: 'Gift wrap', price: 2000, max: 1 },
    ],
  },
  balloonDecoration: {
    tiers: [{ label: 'Basic backdrop', price: 25000 }, { label: 'Standard', price: 60000 }, { label: 'Premium', price: 120000 }],
  },
  training: {
    classes: [
      { label: 'Beginner cake class', price: 35000 },
      { label: 'Pastries & snacks class', price: 45000 },
      { label: 'Cake decorating class', price: 60000 },
    ],
  },
}
