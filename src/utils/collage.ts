export const createSquareCollage = async (files: File[]): Promise<string> => {
  const images = await Promise.all(
    files.map(
      (file) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        })
    )
  );

  if (images.length === 0) return '';

  const count = images.length;
  // Calculate a perfectly square grid size (e.g., 4 = 2x2, 5 = 3x3)
  const gridSize = Math.ceil(Math.sqrt(count));
  const cols = gridSize;
  const rows = gridSize;

  const CELL_SIZE = 800; // High resolution cell size
  const canvas = document.createElement('canvas');
  canvas.width = cols * CELL_SIZE;
  canvas.height = rows * CELL_SIZE;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Fill background incase of empty cells
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = col * CELL_SIZE;
    const y = row * CELL_SIZE;

    // Cover crop logic for each square cell
    const imgRatio = img.width / img.height;
    const cellRatio = 1; // square

    let sx = 0, sy = 0, sw = img.width, sh = img.height;

    if (imgRatio > cellRatio) {
      // Image is proportionally wider than the cell
      sw = img.height * cellRatio;
      sx = (img.width - sw) / 2;
    } else {
      // Image is proportionally taller
      sh = img.width / cellRatio;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, x, y, CELL_SIZE, CELL_SIZE);
  });

  return canvas.toDataURL('image/jpeg', 0.92);
};
