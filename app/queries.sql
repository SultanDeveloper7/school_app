SELECT s.student_id, s.student_first_name, s.student_phone, s.student_birthdate, s.student_gender, s.student_class_id, c.class_name, c.school_id, sc.school_name, p.*, s.student_created FROM students as s
LEFT JOIN parents as p
ON p.parent_id = s.parent_id
LEFT JOIN classes as c
ON c.class_id = s.student_class_id
LEFT JOIN school as sc
ON sc.school_id = c.school_id

SELECT sp.* FROM sub_permission as sp
LEFT JOIN permissions as p
ON p.permission_id = sp.sub_permission_id
WHERE p.permission_id = 15

SELECT sp.*, p.permission_id FROM sub_permission as sp
    JOIN permissions_sub_permissions_rel as psp_rel
    ON psp_rel.sub_permission_id = sp.sub_permission_id
    JOIN permissions as p
    ON p.permission_id = psp_rel.permission_id
    WHERE p.permission_id IN (15, 16)