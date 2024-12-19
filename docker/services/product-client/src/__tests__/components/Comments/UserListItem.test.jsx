import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider, useSelector } from 'react-redux';
import store from '../../../store/store';
import UserListItem from '../../../components/Comments/UserListItem';
const history = createMemoryHistory();

vi.mock('@material-ui/core/styles', () => ({
    makeStyles: () => () => ({
        userListItem: 'userListItem',
        avatar: 'avatar',
        userName: 'userName'
    })
}));

const mockStringToColor = (str) => {
    return `hsl(0, 70%, 60%)`;
};

vi.mock('../../../components/UserListItem', () => ({
    stringToColor: mockStringToColor
}));

describe('UserListItem Component', () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    const onClick = vi.fn();

    it('renders UserListItem component correctly', () => {
        render(<UserListItem user={mockUser} onClick={onClick} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();

        expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('handles click event correctly', () => {
        render(<UserListItem user={mockUser} onClick={onClick} />);

        const userItem = screen.getByText('John Doe');
        fireEvent.click(userItem);

        expect(onClick).toHaveBeenCalledWith(mockUser);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
