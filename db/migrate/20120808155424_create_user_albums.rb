class CreateUserAlbums < ActiveRecord::Migration
  def change
  	create_table :albums_users do |t|
  		t.integer :user_id
  		t.integer :album_id
  		t.timestamps
  	end

  	add_index :albums_users, [:user_id, :album_id], :unique => :true
  	add_index :albums_users, :user_id
  	add_index :albums_users, :album_id
  end
end
