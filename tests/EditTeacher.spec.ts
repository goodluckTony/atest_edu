import { test, expect } from '@playwright/test';
// import { de, faker } from '@faker-js/faker';
import fs from 'fs/promises';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { TeacherListPage } from '../pageobjects/TeacherListPage';
import { Gender, TeacherFormPage, CreateTeacherData } from '../pageobjects/TeacherFormPage';
import { TeacherProfilePage } from '../pageobjects/TeacherProfilePage';
import { EditTeacherProfile } from '../pageobjects/TeacherEditProfile';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';

test.describe('User creation', () => {
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let teacherListPage: TeacherListPage;
  let teacherFormPage: TeacherFormPage;
  let teacherProfilePage: TeacherProfilePage;
  // let user: CreateTeacherData;
  let editTeacherProfile: EditTeacherProfile;
  let teacher;

  // const mainCred = {
  //   email: 'admin-dev@fasted.space',
  //   pass: 'M_3fUn$teEn'
  // };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    teacherListPage = new TeacherListPage(page);
    teacherFormPage = new TeacherFormPage(page);
    teacherProfilePage = new TeacherProfilePage(page);
    editTeacherProfile = new EditTeacherProfile(page);
  });

  test('Should create test teacher', async () => {
    
    const mainCred = AdminCredentials.admin;
    // Generate random user data
    // const randomDate = faker.date.between({ from: '1900-01-01', to: '2025-12-31' });
    // const formattedDate = `${randomDate.getDate().toString().padStart(2, '0')}.${(randomDate.getMonth() + 1).toString().padStart(2, '0')}.${randomDate.getFullYear()}`;
    // const ukrPhoneOperators = ['63', '50', '93', '73', '67', '68', '96', '97', '98', '91', '95', '99'];
    // const randomNumber = faker.phone.number({ style: 'international' });
    // const phone = `+380${faker.helpers.arrayElement(ukrPhoneOperators)}${randomNumber.slice(-7)}`;
    // user = {
    //   lastName: faker.person.lastName(),
    //   firstName: faker.person.firstName(),
    //   surname: faker.person.middleName(),
    //   date: formattedDate,
    //   subject: faker.helpers.arrayElement(['Математика', 'Англійська']),
    //   gender: faker.helpers.arrayElement([Gender.Male, Gender.Female]),
    //   email: faker.internet.email().replace(/@.+$/, '@example.com'),
    //   phone: phone,
    //   telegram: `@${faker.person.firstName()}`,
    //   link: "https://"+faker.internet.domainName()
    // };
    teacher = UserDataGenerator.generateTeacher();

    

    // Login as admin
    await loginPage.open()
    await loginPage.login(mainCred.email, mainCred.pass);
  
  
    // Navigate to teacher form
    await adminPanelUsersPage.navigateToTeachersList();
    await teacherListPage.addNewTeacherBtnClick();
  
    // Fill teacher form
    await teacherFormPage.fillTeacherForm(teacher);
    await teacherFormPage.submitForm();
  
    // Search teacher and verify details
    await teacherListPage.searchTeacherByEmail(teacher.email, teacher.subject);
  
    await expect(teacherProfilePage.getTeacherLastName()).toHaveText(teacher.lastName);
    await expect(teacherProfilePage.getTeacherFirstName()).toHaveText(teacher.firstName);
    await expect(teacherProfilePage.getTeacherSurname()).toHaveText(teacher.surname);
    await expect(teacherProfilePage.getTeacherDate()).toHaveText(teacher.date);
    await expect(teacherProfilePage.getTeacherGender()).toHaveText(teacher.gender === 1 ? "Чоловіча" : "Жіноча");
    await expect(teacherProfilePage.getTeacherEmail()).toHaveText(teacher.email);
    await expect(teacherProfilePage.getTeacherPhone()).toHaveText(teacher.phone);
    await expect(teacherProfilePage.getTeacherTelegram()).toHaveText(teacher.telegram);
    await expect(teacherProfilePage.getTeacherLink()).toHaveText(teacher.link);
    const teacherImage = await teacherProfilePage.getTeacherImage();
    const imageSrc = await teacherImage.getAttribute("src");
    const expectedFileName = teacher.gender === Gender.Male ? "male-img.jpg" : "female-img.jpg";
    await expect(imageSrc).toContain(expectedFileName);


    // Add teacher into test-teachers.json 
    const teachersFilePath = 'test-teachers.json';
    const existingTeachers = await fs.readFile(teachersFilePath, 'utf-8').catch(() => '[]');
    const teachers = JSON.parse(existingTeachers);
    teachers.push(teacher);
    await fs.writeFile(teachersFilePath, JSON.stringify(teachers, null, 2));
    console.log(`User data saved to ${teachersFilePath}`);

    // Edit teacher profile
    await editTeacherProfile.editTeacherProfileButton();
    await editTeacherProfile.editTeacherEmail(teacher);
    await expect(editTeacherProfile.getSaveChangesButton()).toBeEnabled();
  });
});