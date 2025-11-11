// POST /api/upload/donation-files
export async function uploadDonationFiles(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    // Processar arquivos enviados
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/api/uploads/${file.filename}`
    }));

    res.json({
      success: true,
      data: {
        files: uploadedFiles,
        count: uploadedFiles.length
      },
      message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// GET /api/upload/info
export async function getUploadInfo(req, res) {
  res.json({
    success: true,
    data: {
      maxFileSize: '5MB',
      maxFiles: 6,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf']
    },
    message: 'Informações de upload obtidas com sucesso'
  });
}
