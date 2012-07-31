class CreateAlbums < ActiveRecord::Migration
  def change
    create_table :albums do |t|
    	t.string :title
    	t.string :artist
    	t.string :artwork
    	t.string :service
    	t.string :url
      	t.timestamps
    end
  end
end
