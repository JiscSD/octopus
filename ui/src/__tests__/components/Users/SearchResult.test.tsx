import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import * as Components from '@components';

describe('Users Search Result', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const employer1 = 'Employer 1';
    const employer2 = 'Employer 2';

    it('should display first and last name of an author', () => {
        render(
            <Components.UserSearchResult
                user={{
                    createdAt: '',
                    email: '',
                    firstName,
                    id: 'test-user-id',
                    lastName,
                    orcid: 'test-orcid-id',
                    role: 'USER',
                    employment: [],
                    updatedAt: ''
                }}
            />
        );

        expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();
    });

    it('should display a Letter Avatar like: JD', () => {
        render(
            <Components.UserSearchResult
                user={{
                    createdAt: '',
                    email: '',
                    firstName,
                    id: 'test-user-id',
                    lastName,
                    orcid: 'test-orcid-id',
                    role: 'USER',
                    employment: [],
                    updatedAt: ''
                }}
            />
        );

        expect(screen.getByText(`${firstName[0]} ${lastName[0]}`)).toBeInTheDocument();
    });

    it('should display current Employers only', () => {
        render(
            <Components.UserSearchResult
                user={{
                    createdAt: '',
                    email: '',
                    firstName,
                    id: 'test-user-id',
                    lastName,
                    orcid: 'test-orcid-id',
                    role: 'USER',
                    employment: [
                        {
                            role: null,
                            endDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            startDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            department: null,
                            organisation: employer1
                        },
                        {
                            role: null,
                            endDate: {
                                day: '28',
                                year: '2022',
                                month: '10' // this employer will not be displayed
                            },
                            startDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            department: null,
                            organisation: employer2
                        }
                    ],
                    updatedAt: ''
                }}
            />
        );

        expect(screen.getByText(employer1)).toBeInTheDocument();
        expect(screen.queryByText(employer2)).not.toBeInTheDocument();
    });

    it('should display current Employers comma separated', () => {
        render(
            <Components.UserSearchResult
                user={{
                    createdAt: '',
                    email: '',
                    firstName,
                    id: 'test-user-id',
                    lastName,
                    orcid: 'test-orcid-id',
                    role: 'USER',
                    employment: [
                        {
                            role: null,
                            endDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            startDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            department: null,
                            organisation: employer1
                        },
                        {
                            role: null,
                            endDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            startDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            department: null,
                            organisation: employer2
                        }
                    ],
                    updatedAt: ''
                }}
            />
        );

        expect(screen.queryByText(`${employer1}, ${employer2}`)).toBeInTheDocument();
    });

    it('should display current Employer if the endDate year is equal with the current year, but month and day are not specified', () => {
        const endDateYear = new Date().getFullYear().toString();

        render(
            <Components.UserSearchResult
                user={{
                    createdAt: '',
                    email: '',
                    firstName,
                    id: 'test-user-id',
                    lastName,
                    orcid: 'test-orcid-id',
                    role: 'USER',
                    employment: [
                        {
                            role: null,
                            endDate: {
                                day: null,
                                year: endDateYear,
                                month: null
                            },
                            startDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            department: null,
                            organisation: employer1
                        }
                    ],
                    updatedAt: ''
                }}
            />
        );

        expect(screen.queryByText(employer1)).toBeInTheDocument();
    });

    it('should display current Employer if endDate year/month are the same as current year/month, but day is not specified', () => {
        const currentDate = new Date();
        const endDateYear = currentDate.getFullYear().toString();
        const endDateMonth = (currentDate.getMonth() + 1).toString(); // orcid month is starting from 1 while JS Date Object month is starting from 0

        render(
            <Components.UserSearchResult
                user={{
                    createdAt: '',
                    email: '',
                    firstName,
                    id: 'test-user-id',
                    lastName,
                    orcid: 'test-orcid-id',
                    role: 'USER',
                    employment: [
                        {
                            role: null,
                            endDate: {
                                day: null,
                                year: endDateYear,
                                month: endDateMonth
                            },
                            startDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            department: null,
                            organisation: employer1
                        }
                    ],
                    updatedAt: ''
                }}
            />
        );

        expect(screen.queryByText(employer1)).toBeInTheDocument();
    });

    it('should have a link to the author profile page', () => {
        const userId = 'test-user-id';

        const { container } = render(
            <Components.UserSearchResult
                user={{
                    createdAt: '',
                    email: '',
                    firstName,
                    id: userId,
                    lastName,
                    orcid: 'test-orcid-id',
                    role: 'USER',
                    employment: [
                        {
                            role: null,
                            endDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            startDate: {
                                day: null,
                                year: null,
                                month: null
                            },
                            department: null,
                            organisation: employer1
                        }
                    ],
                    updatedAt: ''
                }}
            />
        );

        expect(container.querySelector(`a[href="/authors/${userId}"]`)).toBeInTheDocument();
    });
});
