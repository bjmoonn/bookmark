import { render, screen } from '@testing-library/react';
import LinkField from '@/components/LinkField/LinkField';
import ListItem from '@/components/ListItem/ListItem';
import LinkItem from '@/components/LinkItem/LinkItem';
import BookmarkForm from '@/components/BookmarkForm/BookmarkForm';
import '@testing-library/jest-dom';

test('LinkField renders with placeholder', () => {
  const handleAdd = jest.fn();
  render(<LinkField handleAdd={handleAdd} />);
  
  const input = screen.getByPlaceholderText('Paste link to add bookmark');
  expect(input).toBeInTheDocument();
});

test('ListItem renders title', () => {
  render(
    <ListItem 
      id={1}
      title="Test Item"
      createdAt="2024-01-01"
    />
  );
  
  const title = screen.getByText('Test Item');
  expect(title).toBeInTheDocument();
});

test('ListItem renders date', () => {
  render(
    <ListItem 
      id={1}
      title="Test Item"
      createdAt="2024-01-01"
    />
  );
  
  const date = screen.getByText('12/31/2023');
  expect(date).toBeInTheDocument();
});

test('ListItem renders More button', () => {
  render(
    <ListItem 
      id={1}
      title="Test Item"
      createdAt="2024-01-01"
    />
  );
  
  const moreButton = screen.getByText('More');
  expect(moreButton).toBeInTheDocument();
});

test('LinkItem renders title', () => {
  render(
    <LinkItem 
      id={1}
      title="Test Link"
      url="https://example.com"
      createdAt="2024-01-01"
    />
  );
  
  const title = screen.getByText('Test Link');
  expect(title).toBeInTheDocument();
});

test('LinkItem renders date', () => {
  render(
    <LinkItem 
      id={1}
      title="Test Link"
      url="https://example.com"
      createdAt="2024-01-01"
    />
  );
  
  const date = screen.getByText('12/31/2023');
  expect(date).toBeInTheDocument();
});

test('LinkItem renders More button', () => {
  render(
    <LinkItem 
      id={1}
      title="Test Link"
      url="https://example.com"
      createdAt="2024-01-01"
    />
  );
  
  const moreButton = screen.getByText('More');
  expect(moreButton).toBeInTheDocument();
});

test('BookmarkForm renders title', () => {
  const handleSave = jest.fn();
  const handleCancel = jest.fn();
  
  render(
    <BookmarkForm 
      title="Test Bookmark"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
  
  const heading = screen.getByText('Add bookmark: Test Bookmark');
  expect(heading).toBeInTheDocument();
});

test('BookmarkForm renders folder section', () => {
  const handleSave = jest.fn();
  const handleCancel = jest.fn();
  
  render(
    <BookmarkForm 
      title="Test Bookmark"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
  
  const folderLabel = screen.getByText('Folder (optional)');
  expect(folderLabel).toBeInTheDocument();
});

test('BookmarkForm renders tag section', () => {
  const handleSave = jest.fn();
  const handleCancel = jest.fn();
  
  render(
    <BookmarkForm 
      title="Test Bookmark"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
  
  const tagLabel = screen.getByText('Tag (optional)');
  expect(tagLabel).toBeInTheDocument();
});

test('BookmarkForm renders Save and Cancel buttons', () => {
  const handleSave = jest.fn();
  const handleCancel = jest.fn();
  
  render(
    <BookmarkForm 
      title="Test Bookmark"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
  
  const saveButton = screen.getByText('Save');
  const cancelButton = screen.getByText('Cancel');
  expect(saveButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();
});