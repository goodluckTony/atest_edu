import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import fs from 'fs/promises';
import { assert } from 'console';

test('Should create test teacher', async ({ page }) => {
  // Generated user data using faker
  const randomDate = faker.date.between({ from: '1900-01-01', to: '2025-12-31' });
  const formattedDate = `${randomDate.getDate().toString().padStart(2, '0')}.${(randomDate.getMonth() + 1).toString().padStart(2, '0')}.${randomDate.getFullYear()}`;
  
  const user = {
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    surename: faker.person.middleName(),
    date: formattedDate,
    subject: faker.helpers.arrayElement(['Математика', 'Англійська']),
    gender: faker.helpers.arrayElement([1, 2]),
    email: faker.internet.email().replace(/@.+$/, '@example.com'),
    // phone: `+380${faker.string.numeric(9)}`,
    phone: `${faker.phone.number({ style: 'international' })}`,
    telegram: `@${faker.person.firstName()}`,
    link: faker.internet.domainName()
  };

  const mainCred = {
    email: 'admin-dev@fasted.space',
    pass: 'M_3fUn$teEn'
  };

  // Login to the admin panel
  await page.goto('http://dev-admin.fasted.space/');
  await page.fill("[name='email']", mainCred.email);
  await page.fill("[name='password']", mainCred.pass);
  await page.click("[type='submit']");

  // Nav to teacher section
  await page.click("[href*='teachers/list']");
  await page.click("[href*='teachers/add-new']");

  // Fill the teacher form
  await page.fill("[name='lastName']", user.lastName);
  await page.fill("[name='firstName']", user.firstName);
  await page.fill("[name='surname']", user.surename);
  await page.fill("[name='birthday']", user.date);
  await page.click("[role='combobox']");
  await page.click(`li:has-text('${user.subject}')`);
  await page.click(`span input[value='${user.gender}']`);
  await page.fill("[name='email']", user.email);
  await page.fill("[name='phone']", user.phone);
  await page.fill("[name='telegram']", user.telegram);
  await page.fill("[name='link']", user.link);
  await page.waitForLoadState("networkidle");

  // Submit form
  await page.locator("button[type='submit']").click();
  await page.waitForLoadState("networkidle");
  
  // Verify teacher creation, if NOT found, print the error
  const subjectBtn = page.locator(`button:has-text('${user.subject}')`);
  await subjectBtn.click();
  await page.fill("[placeholder*='Пошук']", user.email);
  const teacherRow = page.locator(`td:nth-child(3):has-text('${user.email}')`);
  teacherRow.waitFor({ state: "visible", timeout: 10000 });
  await expect(teacherRow).toBeVisible();
  await teacherRow.click();

  const map = [
    { label: "Прізвище", form: 1, key: "lastName" },
    { label: "Ім’я", form: 1, key: "firstName" },
    { label: "По батькові", form: 1, key: "surename" },
    { label: "Дата народження", form: 1, key: "date" },
    { label: "Стать", form: 1, key: "gender", transform: val => val === 1 ? "Чоловіча" : "Жіноча" },
    { label: "E-mail", form: 2, key: "email" },
    { label: "Телефон", form: 2, key: "phone" },
    { label: "Telegram", form: 2, key: "telegram" },
    { label: "Лінк", form: 2, key: "link" }
  ];
  let isMatched = true;
  for (const {label, form, key, transform} of map) {
    const locator = await page.locator(`//form[${form}]//p[contains(text(), '${label}')]/following::p[1]`);
    await locator.waitFor({ state: "visible", timeout: 10000 });
    const text = await locator.innerText();
    const expectedVal = transform ? transform(user[key]) : user[key];
    if (text !== expectedVal) {
      console.error(`Mismatch for ${label}: expected "${expectedVal}", but actual is "${text}"`);
      isMatched = false;
    }
    expect(locator).toHaveText(expectedVal);
  }

  // Save gen user data to JSON if matched, if NOT, print the error
  if (isMatched) {
    const usersFilePath = 'test-teachers.json';
    const existingUsers = await fs.readFile(usersFilePath, 'utf-8').catch(() => '[]');
    const users = JSON.parse(existingUsers);
    users.push(user);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    assert(`User data saved to ${usersFilePath}`);
  } else {
    console.log('User data was NOT saved to JSON due to mismatched data');
  }
});
