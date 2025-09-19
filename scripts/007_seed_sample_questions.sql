-- Insert sample quiz questions
insert into public.quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, category, difficulty) values
('What is the capital of France?', 'London', 'Berlin', 'Paris', 'Madrid', 'C', 'Geography', 'easy'),
('Which planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'B', 'Science', 'easy'),
('What is 15 + 27?', '42', '41', '43', '40', 'A', 'Math', 'easy'),
('Who painted the Mona Lisa?', 'Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo', 'C', 'Art', 'medium'),
('What is the largest ocean on Earth?', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 'D', 'Geography', 'easy'),
('In which year did World War II end?', '1944', '1945', '1946', '1947', 'B', 'History', 'medium'),
('What is the chemical symbol for gold?', 'Go', 'Gd', 'Au', 'Ag', 'C', 'Science', 'medium'),
('Which programming language is known for its use in web development?', 'Python', 'JavaScript', 'C++', 'Java', 'B', 'Technology', 'easy'),
('What is the square root of 144?', '11', '12', '13', '14', 'B', 'Math', 'easy'),
('Who wrote "Romeo and Juliet"?', 'Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain', 'B', 'Literature', 'easy'),
('What is the speed of light in vacuum?', '299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '301,000,000 m/s', 'A', 'Science', 'hard'),
('Which element has the atomic number 1?', 'Helium', 'Hydrogen', 'Lithium', 'Carbon', 'B', 'Science', 'medium'),
('What is the largest mammal in the world?', 'African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear', 'B', 'Biology', 'easy'),
('In which country is Machu Picchu located?', 'Chile', 'Bolivia', 'Peru', 'Ecuador', 'C', 'Geography', 'medium'),
('What does "HTTP" stand for?', 'HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'HyperText Transport Protocol', 'High Transfer Text Protocol', 'A', 'Technology', 'medium'),
('Which gas makes up about 78% of Earth''s atmosphere?', 'Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon', 'C', 'Science', 'medium'),
('What is the smallest prime number?', '0', '1', '2', '3', 'C', 'Math', 'easy'),
('Who developed the theory of relativity?', 'Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking', 'B', 'Science', 'easy'),
('What is the currency of Japan?', 'Yuan', 'Won', 'Yen', 'Ringgit', 'C', 'Geography', 'easy'),
('Which planet is closest to the Sun?', 'Venus', 'Earth', 'Mercury', 'Mars', 'C', 'Science', 'easy')
on conflict do nothing;
