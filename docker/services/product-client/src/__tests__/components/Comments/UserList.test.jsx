import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider, useSelector } from 'react-redux';
import store from '../../../store/store';
import UserList from '../../../components/Comments/UserList';
import { upload_file } from '../../../common/utils';
import { addReply } from '../../../services/comments';
const history = createMemoryHistory();

describe('UserList Component', () => {
    const mockUsers = [
        { first_name: 'John', last_name: 'Doe' },
        { first_name: 'Jane', last_name: 'Smith' }
    ];

    const onSelect = vi.fn();

    it('renders UserList component correctly', () => {
        render(<UserList users={mockUsers} onSelect={onSelect} filter="" />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('filters users based on input', () => {
        render(<UserList users={mockUsers} onSelect={onSelect} filter="Jane" />);
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('calls onSelect with the correct user when an item is clicked', () => {
        render(<UserList users={mockUsers} onSelect={onSelect} filter="" />);

        const userItem = screen.getByText('John Doe');
        fireEvent.click(userItem);

        expect(onSelect).toHaveBeenCalledWith({ first_name: 'John', last_name: 'Doe' });
        expect(onSelect).toHaveBeenCalledTimes(1);
    });
});
