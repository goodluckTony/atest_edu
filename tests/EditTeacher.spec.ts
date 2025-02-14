import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { TeacherListPage } from '../pageobjects/TeacherListPage';
import { Gender, TeacherFormPage, CreateTeacherData } from '../pageobjects/TeacherFormPage';
import { TeacherProfilePage } from '../pageobjects/TeacherProfilePage';
import { TeacherEditProfilePage } from '../pageobjects/TeacherEditProfilePage';
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';
import { ApiHelper } from "../pageobjects/utils/ApiHelper";

test.describe('User creation', () => {
  let apiHelper: ApiHelper;
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let teacherListPage: TeacherListPage;
  let teacherFormPage: TeacherFormPage;
  let teacherProfilePage: TeacherProfilePage;
  let teacherEditProfilePage: TeacherEditProfilePage;
  let teacher;
  let newTeacher;
  let token: string;
  let userId: number;

  test.beforeEach(async ({ page, request }) => {
    apiHelper = new ApiHelper(request, "http://dev-api.fasted.space");
    loginPage = new LoginPage(page, apiHelper);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    teacherListPage = new TeacherListPage(page);
    teacherFormPage = new TeacherFormPage(page, apiHelper);
    teacherProfilePage = new TeacherProfilePage(page);
    teacherEditProfilePage = new TeacherEditProfilePage(page);
  });

  test('Should create test teacher', async ({ page }) => {
    
    const mainCred = AdminCredentials.admin;
    teacher = UserDataGenerator.generateTeacher();
    newTeacher = UserDataGenerator.generateTeacher();

    // Login as admin
    await loginPage.open()
    await loginPage.login(mainCred.email, mainCred.pass);
    token = loginPage.accessToken;
    if (!token) {
      throw new Error("Access token not received after login.");
    }
  
    // Navigate to teacher form
    await adminPanelUsersPage.navigateToTeachersList();
    await teacherListPage.addNewTeacherBtnClick();
  
    // Fill teacher form
    await teacherFormPage.fillTeacherForm(teacher);
    // await teacherFormPage.submitForm();

    // Submit and capture teacher ID
    userId = await teacherFormPage.submitForm();
    console.log(`Captured Teacher ID: ${userId}`);
  
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
    // const teachersFilePath = 'test-teachers.json';
    // const existingTeachers = await fs.readFile(teachersFilePath, 'utf-8').catch(() => '[]');
    // const teachers = JSON.parse(existingTeachers);
    // teachers.push(teacher);
    // await fs.writeFile(teachersFilePath, JSON.stringify(teachers, null, 2));
    // console.log(`User data saved to ${teachersFilePath}`);

    // Edit teacher profile
    await teacherEditProfilePage.editTeacherProfile(newTeacher);

    // await teacherEditProfilePage.editTeacherProfileButton();
    // await teacherEditProfilePage.editTeacherLastname(newTeacher.lastName);
    // await teacherEditProfilePage.editTeacherFirstname(newTeacher.firstName);
    // await teacherEditProfilePage.editTeacherSurname(newTeacher.surname);
    // await teacherEditProfilePage.editTeacherBirthday(newTeacher.date);
    // await teacherEditProfilePage.editTeacherGender(newTeacher.gender);
    // await teacherEditProfilePage.editTeacherEmail(newTeacher.email);
    // await teacherEditProfilePage.editTeacherPhone(newTeacher.phone);
    // await teacherEditProfilePage.editTeacherTelegram(newTeacher.telegram);
    // await teacherEditProfilePage.editTeacherLink(newTeacher.link);
    // await expect(teacherEditProfilePage.getSaveChangesButton()).toBeEnabled();

  });
  
  test.afterEach(async () => {
    // token = loginPage.accessToken;
    // userId = teacherFormPage.teacherId;

    // DELETE created teacher via API
    console.log(`Attempting to delete user. ID: ${userId}, Token: ${token}`);
    if(userId && token) {
      const isDeleted = await apiHelper.deleteUser(userId, token);
      await expect(isDeleted).toBe(true);
      console.log(`Teacher with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID or Token is missing. Skipping deletion.');
    }
  });
});