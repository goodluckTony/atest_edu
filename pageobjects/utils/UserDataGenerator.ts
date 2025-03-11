import { de, faker } from '@faker-js/faker';
import { CreateTeacherData, Gender } from '../TeacherFormPage';
import { CreateStudentData } from '../StudentFormPage';

export class UserDataGenerator {
    private static ukrPhoneOperators = ['63', '50', '93', '73', '67', '68', '96', '97', '98', '91', '95', '99'];
    
    private static generateRandomDate(): string {
        const randomDate = faker.date.between({ from: '1900-01-01', to: '2025-12-31' });
        return `${randomDate.getDate().toString().padStart(2, '0')}.${(randomDate.getMonth() + 1).toString().padStart(2, '0')}.${randomDate.getFullYear()}`;
    }
    private static generateApiRandomDate(): string {
        const randomDate = faker.date.between({ from: '1900-01-01', to: '2025-12-31' });
        return `${randomDate.getFullYear()}-${(randomDate.getMonth() + 1).toString().padStart(2, '0')}-${randomDate.getDate().toString().padStart(2, '0')}`;
    }

    private static generateRandomPhoneNumber(): string {
        const randomNumber = faker.phone.number({ style: 'international' });
        return `+380${faker.helpers.arrayElement(this.ukrPhoneOperators)}${randomNumber.slice(-7)}`;
    }

    public static generateTeacher(isApiFormat: boolean = false): CreateTeacherData {
        const gender = faker.helpers.arrayElement([Gender.Male, Gender.Female]);
        const date = isApiFormat ? this.generateApiRandomDate() : this.generateRandomDate();
        return {
            lastName: faker.person.lastName(),
            firstName: faker.person.firstName(),
            surname: faker.person.middleName(),
            // date: this.generateRandomDate(),
            date,
            subject: faker.helpers.arrayElement(['Математика', 'Англійська']),
            gender,
            email: faker.internet.email().replace(/@.+$/, '@example.com'),
            phone: this.generateRandomPhoneNumber(),
            telegram: `@${faker.person.firstName()}`,
            link: "https://" + faker.internet.domainName(),
        };
    }

    public static generateStudent(isApiFormat: boolean = false): CreateStudentData {
        const date = isApiFormat ? this.generateApiRandomDate() : this.generateRandomDate();
        return {
            lastName: faker.person.lastName(),
            firstName: faker.person.firstName(),
            surname: faker.person.middleName(),
            date,
            email: faker.internet.email().replace(/@.+$/, '@example.com'),
            phone: this.generateRandomPhoneNumber(),
            telegram: `@${faker.person.firstName()}`,
        };
    }
}