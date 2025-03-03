const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/complaint');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Ensure this directory exists and is writable
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// POST /api/complaints - Create a new complaint
router.post('/', upload.single('fileUpload'), 
    [
        body('reportdate').notEmpty().withMessage('Report date is required.'),
        body('typeOfRoom').notEmpty().withMessage('Department selection is required.'),
        body('fname').isAlpha().withMessage('First name must contain only alphabets.'),
        body('lname').isAlpha().withMessage('Last name must contain only alphabets.'),
        body('email').optional().isEmail().withMessage('Valid email is required.'),
        body('phno').isMobilePhone('any').withMessage('Valid phone number is required.'),
        body('District').notEmpty().withMessage('District is required.'),
        body('address1').notEmpty().withMessage('Address line 1 is required.'),
        body('city').isAlpha().withMessage('City must contain only alphabets.'),
        body('state').isAlpha().withMessage('State must contain only alphabets.'),
        body('zipcode').isNumeric().withMessage('Zip Code must contain only numbers.'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const complaint = new Complaint({
            reportDate: req.body.reportdate,
            department: req.body.typeOfRoom,
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            phoneNumber: req.body.phno,
            District: req.body.District,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            comment: req.body.comment,
            photograph: req.file ? req.file.path : null,
        });

        try {
            await complaint.save();
            res.json({ message: 'Complaint submitted successfully!', complaint });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to save complaint' });
        }
    }
);

// GET /api/complaints - Fetch all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch complaints' });
    }
});

// DELETE /api/complaints/:id - Delete a specific complaint
router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete complaint' });
    }
});

// Resolve a complaint
router.patch('/:id/resolve', async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        complaint.status = 'Resolved'; // Update status
        await complaint.save();

        res.json({ message: 'Complaint marked as resolved' });
    } catch (error) {
        console.error('Error resolving complaint:', error);
        res.status(500).json({ error: 'Failed to resolve complaint' });
    }
});


module.exports = router;