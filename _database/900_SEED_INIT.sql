-- SEED DATA
-- This file contains seed data for development and testing

-- Insert 5 users
INSERT INTO users (user_id, email, first_name, last_name, role) VALUES
    ('user_001', 'alice.johnson@example.com', 'Alice', 'Johnson', 'admin'),
    ('user_002', 'bob.smith@example.com', 'Bob', 'Smith', 'user'),
    ('user_003', 'carol.williams@example.com', 'Carol', 'Williams', 'user'),
    ('user_004', 'david.brown@example.com', 'David', 'Brown', 'user'),
    ('user_005', 'emma.davis@example.com', 'Emma', 'Davis', 'user');

-- Insert a memorial
INSERT INTO memorials (memorial_id, name, name_slug, birth_date_str, death_date_str, obituary, is_obituary_public, owner, created_by) VALUES
    (
        'memorial_001',
        'John Michael Thompson',
        'john-michael-thompson',
        '1955-03-15',
        '2024-11-20',
        'John Michael Thompson was a beloved husband, father, and grandfather who touched the lives of everyone he met. Born in Chicago in 1955, John grew up with a deep love for literature and the outdoors. He attended the University of Illinois, where he met his future wife, Margaret, and began a lifelong journey of learning and teaching.

After earning his doctorate in English Literature, John dedicated over 30 years to teaching at the university level. His passion for the written word was infectious, and he inspired countless students to pursue their own dreams in literature and education. John was known for his engaging lectures, his open-door policy for students, and his unwavering support for those who needed guidance both academically and personally.

Outside the classroom, John was an avid hiker and chess enthusiast. He spent many weekends exploring the trails around Chicago and beyond, often accompanied by his children and, later, his grandchildren. His love for nature was matched only by his love for family. John cherished every moment spent with Margaret, his wife of 45 years, and their three children. Family gatherings were filled with laughter, stories, and spirited chess matches that became a cherished tradition.

John also gave back to his community in numerous ways. He volunteered at local libraries, organized book drives for underprivileged schools, and led summer reading programs for children. His commitment to service and education left a lasting impact on everyone who had the privilege of knowing him.

John Michael Thompson will be deeply missed by his wife Margaret, his three children, and seven grandchildren. His legacy lives on in the lives he touched, the students he inspired, and the family he loved so dearly. His memory will continue to guide and inspire all who knew him.',
        true,
        'user_001',
        'user_001'
    );

-- Add the memorial creator as an admin user
INSERT INTO memorial_users (memorial_id, user_id, role, relation) VALUES
    ('memorial_001', 'user_001', 'admin', 'Daughter'),
    ('memorial_001', 'user_002', 'user', 'Friend'),
    ('memorial_001', 'user_003', 'user', 'Colleague');

-- Insert posts from different users
INSERT INTO posts (memorial_id, content, created_by, created_at) VALUES
    (
        'memorial_001',
        'Dad, you were the best father anyone could ask for. Your wisdom and kindness shaped who I am today. I miss our Sunday morning coffee talks. Love you always.',
        'user_001',
        '2024-11-21 10:30:00+00'
    ),
    (
        'memorial_001',
        'Professor Thompson changed my life. His introduction to Shakespeare class opened up a whole new world for me. I went on to study literature because of his inspiration. Thank you for everything, Professor.',
        'user_002',
        '2024-11-21 14:15:00+00'
    ),
    (
        'memorial_001',
        'John was not just a colleague but a true friend. We shared so many laughs in the faculty lounge. He always knew how to lighten the mood during stressful times. The university won''t be the same without him.',
        'user_001',
        '2024-11-22 09:45:00+00'
    ),
    (
        'memorial_001',
        'Remembering the camping trips we took together. John had such a great sense of adventure and always knew the best hiking trails. Here''s to the memories we made under the stars.',
        'user_003',
        '2024-11-22 16:20:00+00'
    );

-- Insert comments on posts
INSERT INTO comments (memorial_id, post_id, content, created_by, created_at) VALUES
    (
        'memorial_001',
        1,
        'Your dad was so proud of you. He talked about you all the time.',
        'user_002',
        '2024-11-21 11:00:00+00'
    ),
    (
        'memorial_001',
        1,
        'Sending you all my love during this difficult time.',
        'user_003',
        '2024-11-21 12:30:00+00'
    ),
    (
        'memorial_001',
        2,
        'He was an incredible teacher. I took his Victorian literature class and it was unforgettable.',
        'user_003',
        '2024-11-21 15:00:00+00'
    ),
    (
        'memorial_001',
        3,
        'I remember those days! John always had the best stories.',
        'user_002',
        '2024-11-22 10:15:00+00'
    ),
    (
        'memorial_001',
        4,
        'Those trips were legendary. He taught me so much about nature.',
        'user_001',
        '2024-11-22 17:00:00+00'
    );

-- Insert reactions on posts
INSERT INTO reactions (memorial_id, post_id, user_id, created_at) VALUES
-- post 1 reactions
    ('memorial_001', 1, 'user_002', '2024-11-21 10:45:00+00'),
    ('memorial_001', 1, 'user_003', '2024-11-21 11:15:00+00'),
-- post 2 reactions
    ('memorial_001', 2, 'user_001', '2024-11-21 14:30:00+00'),
    ('memorial_001', 2, 'user_003', '2024-11-21 15:15:00+00'),
-- post 3 reactions
    ('memorial_001', 3, 'user_002', '2024-11-22 09:50:00+00'),
    ('memorial_001', 3, 'user_003', '2024-11-22 10:00:00+00'),
    ('memorial_001', 3, 'user_001', '2024-11-22 10:00:00+00'),
    ('memorial_001', 3, 'user_002', '2024-11-22 10:30:00+00'),
-- post 4 reactions
    ('memorial_001', 4, 'user_001', '2024-11-22 16:45:00+00'),
    ('memorial_001', 4, 'user_002', '2024-11-22 17:15:00+00'),
    ('memorial_001', 4, 'user_003', '2024-11-22 18:00:00+00');