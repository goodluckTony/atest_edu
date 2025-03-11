import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import { LoginPage } from '../pageobjects/LoginPage';
import { AdminPanelUsersPage } from '../pageobjects/AdminPanelUsersPage';
import { StudentListPage } from '../pageobjects/StudentListPage';
import { StudentFormPage } from '../pageobjects/StudentFormPage';
import { StudentProfilePage } from '../pageobjects/StudentProfilePage';
import { StudentEditProfilePage } from "../pageobjects/StudentEditProfilePage";
import { AdminCredentials } from '../pageobjects/utils/AdminCredentials';
import { UserDataGenerator } from '../pageobjects/utils/UserDataGenerator';
import { ApiHelper } from "../pageobjects/utils/ApiHelper";

test.describe("Student creation", () => {
    let loginPage: LoginPage;
    let adminPanelUsersPage: AdminPanelUsersPage;
    let studentListPage: StudentListPage;
    let studentFormPage: StudentFormPage;
    let studentProfilePage: StudentProfilePage;
    let studentEditProfilePage: StudentEditProfilePage;
    let student;
    let newStudent;
    let apiHelper: ApiHelper;
    let userId: number | null;
    let mainCred: {email: string, pass: string};

    test.beforeEach(async ({ page, request }) => {
      mainCred = AdminCredentials.admin;
      loginPage = new LoginPage(page);
      adminPanelUsersPage = new AdminPanelUsersPage(page);
      studentListPage = new StudentListPage(page);
      studentFormPage = new StudentFormPage(page);
      studentProfilePage = new StudentProfilePage(page);
      studentEditProfilePage = new StudentEditProfilePage(page);
      student = UserDataGenerator.generateStudent(true);
      apiHelper = await ApiHelper.create(request, "https://dev-api.fasted.space", mainCred.email, mainCred.pass);
        
      });
      
      test('Should edit existing student', async () => {
        // Generate random user data
        newStudent = UserDataGenerator.generateStudent();
        
        // TODO: create student by API

        // Login as admin
        await loginPage.open();
        await loginPage.login(mainCred.email, mainCred.pass);

        // Navigate to the admin panel
        userId = await apiHelper.createStudent(student);

        // Navigate to student tab
        await adminPanelUsersPage.navigateToStudentsList();

        // Search for the student in the list and check if the data is correct
        await studentListPage.searchApiStudentByEmail(student.email, student.telegram);

        // Edit teacher profile
        await studentEditProfilePage.editTeacherProfile(newStudent);

        // Verify edit teacher data
        await adminPanelUsersPage.navigateToMainPage();
        await adminPanelUsersPage.navigateToStudentsList();
        await studentListPage.searchStudentByEmail(student.email, student.telegram);

        await expect(studentProfilePage.getStudentLastName()).toHaveText(newStudent.lastName);
        await expect(studentProfilePage.getStudentFirstName()).toHaveText(newStudent.firstName);
        await expect(studentProfilePage.getStudentSurname()).toHaveText(newStudent.surname);
        await expect(studentProfilePage.getStudentDate()).toHaveText(newStudent.date);
        await expect(studentProfilePage.getStudentEmail()).toHaveText(newStudent.email);
        await expect(studentProfilePage.getStudentPhone()).toHaveText(newStudent.phone);
        await expect(studentProfilePage.getStudentTelegram()).toHaveText(newStudent.telegram);
        // TODO: add verifications for all other fields!!!
    });

    test.afterEach(async () => {
        // DELETE created user via API
        console.log(`Attempting to delete user. ID: ${userId}`);
        if(userId) {
            await apiHelper.deleteUser(userId);
            console.log(`Student with ID ${userId} deleted successfully.`)
        } else {
            console.warn('User ID or Token is missing. Skipping deletion.');
        }
    });
});