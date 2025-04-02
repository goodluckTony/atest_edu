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
import { emit } from 'process';
import { config } from '../config';

test.describe('Teacher edit', () => {
  let apiHelper: ApiHelper;
  let loginPage: LoginPage;
  let adminPanelUsersPage: AdminPanelUsersPage;
  let teacherListPage: TeacherListPage;
  let teacherFormPage: TeacherFormPage;
  let teacherProfilePage: TeacherProfilePage;
  let teacherEditProfilePage: TeacherEditProfilePage;
  let teacher;
  let newTeacher;
  let userId: number | null;
  let mainCred: {email: string, pass: string}

  test.beforeEach(async ({ page, request }) => {
    loginPage = new LoginPage(page);
    adminPanelUsersPage = new AdminPanelUsersPage(page);
    teacherListPage = new TeacherListPage(page);
    teacherFormPage = new TeacherFormPage(page);
    teacherProfilePage = new TeacherProfilePage(page);
    teacherEditProfilePage = new TeacherEditProfilePage(page);
    mainCred = AdminCredentials.admin;
    teacher = UserDataGenerator.generateTeacher(true);
    apiHelper = await ApiHelper.create(request, config.apiUrl!, mainCred.email, mainCred.pass);
  });

  test('Should edit existing teacher', async ({ page }) => {
    // Generate random user data
    newTeacher = UserDataGenerator.generateTeacher();

    // Login as admin
    await loginPage.open()
    await loginPage.login(mainCred.email, mainCred.pass);

    // Create teacher via api
    userId = await apiHelper.createTeacher(teacher);
  
    // Navigate to teacher form
    await adminPanelUsersPage.navigateToTeachersList();

    // Search teacher and verify details
    await teacherListPage.searchTeacherByEmail(teacher.email, teacher.subject);

    // Edit teacher profile
    await teacherEditProfilePage.editTeacherProfile(newTeacher);
    
    // Verify edited teacher data
    await adminPanelUsersPage.navigateToMainPage();
    await adminPanelUsersPage.navigateToTeachersList();
    await teacherListPage.searchTeacherByEmail(newTeacher.email, newTeacher.subject);

    await expect(teacherProfilePage.getTeacherLastName()).toHaveText(newTeacher.lastName);
    await expect(teacherProfilePage.getTeacherFirstName()).toHaveText(newTeacher.firstName);
    await expect(teacherProfilePage.getTeacherSurname()).toHaveText(newTeacher.surname);
    await expect(teacherProfilePage.getTeacherDate()).toHaveText(newTeacher.date);
    await expect(teacherProfilePage.getTeacherEmail()).toHaveText(newTeacher.email);
    await expect(teacherProfilePage.getTeacherPhone()).toHaveText(newTeacher.phone);
    await expect(teacherProfilePage.getTeacherTelegram()).toHaveText(newTeacher.telegram);
    // TODO: add avatar verification (similar to student)
  });
  
  test.afterEach(async ({page}) => {
    // DELETE created teacher via API
    console.log(`Attempting to delete user. ID: ${userId}`);
    if(userId) {
      await apiHelper.deleteUser(userId);
      console.log(`Teacher with ID ${userId} deleted successfully.`)
    } else {
      console.warn('User ID or Token is missing. Skipping deletion.');
    }
  });
});