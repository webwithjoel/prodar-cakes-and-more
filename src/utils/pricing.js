export function bulkPercent(product, qty) {
  const rules = product?.bulk_rules ?? []
  const matching = rules
    .filter((rule) => Number(qty) >= Number(rule.min))
    .sort((a, b) => Number(b.min) - Number(a.min))
  return matching[0]?.pct ?? 0
}

export function cakeBase(size, layers, customization = {}) {
  const table = customization.priceTable ?? customization.basePrices
  return Number(table?.[String(size)]?.[Number(layers)] ?? 0)
}

function selectedLabel(selections, keys) {
  for (const key of keys) {
    if (typeof selections[key] === 'string') return selections[key]
  }
  return null
}

function roundNearestNaira(amount) {
  return Math.round(amount)
}

export function calcLineTotal(product, selections = {}, qty = 1) {
  if (!product) return 0
  const quantity = Math.max(1, Number(qty) || 1)
  const config = product.customization ?? {}
  let subtotal = 0

  if (config.model === 'cake') {
    const defaults = config.defaults ?? {}
    const size = selections.size ?? defaults.size ?? config.size?.default
    const layers = Number(selections.layers ?? defaults.layers ?? config.layers?.default ?? 1)
    const base = cakeBase(size, layers, config)
    const flavour = selectedLabel(selections, ['flavour', 'flavour_label']) ?? defaults.flavour
    const finish = selectedLabel(selections, ['finish', 'finish_label']) ?? defaults.finish
    const flavourOption = (config.flavours ?? []).find((option) => option.label === flavour)
    const finishOption = (config.finishes ?? []).find((option) => option.label === finish)
    subtotal = base + (flavourOption?.surcharge ?? 0)
    if (finishOption?.type === 'percent') {
      subtotal += Math.round(subtotal * (Number(finishOption.value) / 100))
    }
    const addonSelections = selections.addons ?? defaults.addons ?? {}
    for (const addon of config.addons ?? []) {
      const count = Number(addonSelections[addon.id] ?? 0)
      if (count > 0) subtotal += Number(addon.price) * Math.min(count, addon.max)
    }
  } else if (config.model === 'wedding') {
    const tier = (config.tiers ?? []).find((option) => option.label === selections.tier) ?? config.tiers?.[0]
    subtotal = Number(tier?.price ?? product.base_price)
    const flavour = selectedLabel(selections, ['flavour', 'flavour_label'])
    const tierCount = String(tier?.label ?? '').startsWith('3-tier') ? 3 : 2
    const flavourOption = (config.flavoursPerTier ?? []).find((option) => option.label === flavour)
    subtotal += (flavourOption?.surcharge ?? 0) * tierCount
    for (const addon of config.addons ?? []) {
      const count = Number(selections.addons?.[addon.id] ?? 0)
      if (count > 0) subtotal += Number(addon.price) * Math.min(count, addon.max)
    }
  } else if (config.model === 'unit') {
    if (config.variants) {
      const variant = config.variants.find((option) => option.label === selections.variant) ?? config.variants[0]
      subtotal = Number(variant?.price ?? product.base_price)
    } else if (config.unitPrice) {
      subtotal = Number(config.unitPrice)
      const flavour = (config.flavours ?? []).find((option) => option.label === selections.flavour)
      subtotal += flavour?.surcharge ?? 0
      if (selections.themedCases) subtotal += Number(config.themedCases ?? 0)
    } else if (config.toppings) {
      subtotal = Number(config.unitPrice ?? product.base_price)
    } else {
      subtotal = Number(product.base_price)
    }
    subtotal += selections.giftPack ? Number(config.giftPack ?? 0) : 0
    subtotal += Number(selections.eventLabelUnits ?? 0) * Number(config.eventLabel ?? 0)
    if (config.toppings && typeof config.toppings === 'number') {
      subtotal += Number(selections.extraToppings ? config.toppings : 0)
    }
  } else if (config.model === 'tiered') {
    if (config.variants) {
      const variant = config.variants.find((option) => option.label === selections.variant) ?? config.variants[0]
      subtotal = Number(variant?.price ?? product.base_price)
    } else if (config.sizes) {
      const size = config.sizes.find((option) => option.label === selections.size) ?? config.sizes[0]
      subtotal = Number(size?.price ?? product.base_price)
      subtotal += Number(selections.pepperSauce ?? 0) * Number(config.pepperSauce ?? 0)
    } else if (config.tiers) {
      const tier = config.tiers.find((option) => option.label === selections.tier) ?? config.tiers[0]
      subtotal = Number(tier?.price ?? product.base_price)
      for (const addon of config.addons ?? []) {
        const count = Number(selections.addons?.[addon.id] ?? 0)
        if (count > 0) subtotal += Number(addon.price) * Math.min(count, addon.max)
      }
    } else if (config.classes) {
      const training = config.classes.find((option) => option.label === selections.class) ?? config.classes[0]
      subtotal = Number(training?.price ?? product.base_price)
    }
  } else {
    subtotal = Number(product.base_price)
  }

  const lineBeforeDiscount = subtotal * quantity
  const pct = bulkPercent(product, quantity)
  return roundNearestNaira(lineBeforeDiscount * (1 - pct / 100))
}

export function selfCheckPricing() {
  const products = []
  const cake = {
    customization: {
      model: 'cake',
      priceTable: {
        '8': { 1: 18000, 2: 30000 },
      },
      flavours: [{ label: 'Red velvet', surcharge: 2000 }],
      finishes: [{ label: 'Buttercream', type: 'none' }, { label: 'Fondant', type: 'percent', value: 25 }],
      addons: [
        { id: 'printed-topper', label: 'Printed character/theme topper', price: 3000, max: 1 },
        { id: 'name-plaque', label: 'Name/message plaque', price: 1500, max: 1 },
      ],
      defaults: {},
    },
  }
  products.push(cake)

  const expected = [36500]
  const actual = [
    calcLineTotal(cake, {
      size: '8',
      layers: 2,
      flavour: 'Red velvet',
      finish: 'Buttercream',
      addons: { 'printed-topper': 1, 'name-plaque': 1 },
    }, 1),
  ]

  const fondant = calcLineTotal({
    customization: {
      model: 'cake',
      priceTable: { '8': { 1: 18000, 2: 30000 } },
      flavours: [],
      finishes: [{ label: 'Fondant', type: 'percent', value: 25 }],
      addons: [],
    },
  }, { size: '8', layers: 2, finish: 'Fondant' }, 1)
  actual.push(fondant)
  expected.push(37500)

  const wedding = calcLineTotal({
    base_price: 95000,
    customization: {
      model: 'wedding',
      tiers: [{ label: '2-tier · 6″ + 8″', price: 95000 }],
      addons: [
        { id: 'mr-mrs-topper', price: 5000, max: 1 },
        { id: 'wedding-flowers', price: 12000, max: 1 },
      ],
    },
  }, { tier: '2-tier · 6″ + 8″', addons: { 'mr-mrs-topper': 1, 'wedding-flowers': 1 } }, 1)
  actual.push(wedding)
  expected.push(112000)

  const cupcakes = calcLineTotal({
    base_price: 700,
    customization: { model: 'unit', unitPrice: 700, flavours: [] },
    bulk_rules: [{ min: 24, pct: 5 }, { min: 50, pct: 10 }],
  }, {}, 24)
  actual.push(cupcakes)
  expected.push(15960)

  const chinchin = calcLineTotal({
    customization: {
      model: 'unit',
      variants: [{ label: 'Medium jar', price: 4000 }],
      giftPack: 1000,
      eventLabel: 150,
    },
    bulk_rules: [{ min: 10, pct: 5 }, { min: 30, pct: 10 }],
  }, { variant: 'Medium jar', eventLabelUnits: 12 }, 12)
  actual.push(chinchin)
  expected.push(47310)

  const parfait = calcLineTotal({
    customization: {
      model: 'unit',
      variants: [{ label: 'Regular cup', price: 3000 }],
      toppings: 500,
    },
  }, { variant: 'Regular cup', extraToppings: true }, 6)
  actual.push(parfait)
  expected.push(21000)

  const failed = expected.findIndex((value, index) => value !== actual[index])
  if (failed !== -1) {
    console.error('Pricing worked example failed', { index: failed + 1, expected: expected[failed], actual: actual[failed] })
  } else {
    console.info('Prodar pricing worked examples passed', actual)
  }
  return actual
}
