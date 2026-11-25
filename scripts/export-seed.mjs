import { categories } from '../src/data/categories.js'
import { products } from '../src/data/products.js'

function sqlString(value) {
  if (value === null || typeof value === 'undefined') return 'null'
  return `'${String(value).replaceAll("'", "''")}'`
}

function jsonSql(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`
}

console.log('-- Generated from src/data/categories.js and src/data/products.js')
console.log('-- Run supabase/schema.sql before this seed.')
console.log()

for (const category of categories) {
  console.log(
    `insert into categories (id, slug, name, blurb, image, sort_order, is_active) values (${sqlString(category.id)}, ${sqlString(category.slug)}, ${sqlString(category.name)}, ${sqlString(category.blurb)}, ${sqlString(category.image)}, ${category.sort_order}, ${category.is_active});`,
  )
}

console.log()
for (const product of products) {
  console.log(
    `insert into products (id, slug, category_slug, name, short_description, image, base_price, price_label, price_model, customization, bulk_rules, is_featured, is_active, sort_order) values (${sqlString(product.id)}, ${sqlString(product.slug)}, ${sqlString(product.category_slug)}, ${sqlString(product.name)}, ${sqlString(product.short_description)}, ${sqlString(product.image)}, ${product.base_price}, ${sqlString(product.price_label)}, ${sqlString(product.price_model)}, ${jsonSql(product.customization)}, ${jsonSql(product.bulk_rules)}, ${product.is_featured}, ${product.is_active}, ${product.sort_order});`,
  )
}
